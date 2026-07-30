import { Component, computed, inject } from '@angular/core';
import { ConstructorService, Flower, SelectedFlower } from '../../../../core/services/constructor.service';

interface FlowerPosition {
  x: number;
  y: number;
  rotation: number;
  size: number;
  midBend: number;
}

interface PlacedFlower extends SelectedFlower {
  x: number;
  y: number;
  rotation: number;
  size: number;
  stemPath: string;
  leafPaths: string[];
}

const VASE_X = 300;

const ROWS = [
  { yOffset: 85,  maxCount: 4, spread: 140 },
  { yOffset: 145, maxCount: 5, spread: 160 },
  { yOffset: 200, maxCount: 5, spread: 150 },
  { yOffset: 250, maxCount: 4, spread: 130 },
  { yOffset: 295, maxCount: 4, spread: 110 },
  { yOffset: 332, maxCount: 3, spread: 90  },
  { yOffset: 362, maxCount: 3, spread: 70  },
];
const VASE_TOP = 420;

@Component({
  standalone: true,
  selector: 'app-bouquet-canvas',
  templateUrl: './bouquet-canvas.component.html',
  styleUrl: './bouquet-canvas.component.scss',
})
export class BouquetCanvas {
  readonly constructorService = inject(ConstructorService);

  private readonly jitterCache = new Map<string, {
    dx: number; dy: number; rotation: number; midBend: number;
    leafL: { t: number; w: number };
    leafR: { t: number; w: number };
  }>();

  private getJitter(id: string) {
    let j = this.jitterCache.get(id);
    if (!j) {
      j = {
        dx: (Math.random() - 0.5) * 22,
        dy: (Math.random() - 0.5) * 18,
        rotation: (Math.random() - 0.5) * 40,
        midBend: (Math.random() - 0.5) * 15,
        leafL: { t: 0.30 + Math.random() * 0.38, w: 13 + Math.random() * 11 },
        leafR: { t: 0.30 + Math.random() * 0.38, w: 13 + Math.random() * 11 },
      };
      this.jitterCache.set(id, j);
    }
    return j;
  }

  readonly placedFlowers = computed<PlacedFlower[]>(() => {
    const flowers = this.constructorService.selectedFlowers();
    const visible = flowers.slice(0, 28);
    const positions = this.buildPositions(visible.length, (i) => visible[i].id);
    const isVase = this.constructorService.selectedWrapping().id === 'none';
    const neckY = isVase ? 522 : 438;

    return visible
      .map((f, i) => {
        const pos = positions[i];
        // For vase: fan stems across the wide opening instead of all meeting at center
        const baseX = isVase
          ? Math.round(VASE_X + Math.max(-50, Math.min(50, (pos.x - VASE_X) * 0.38)))
          : VASE_X;
        return {
          ...f,
          x: pos.x,
          y: pos.y,
          rotation: pos.rotation,
          size: pos.size,
          stemPath: this.getStemPath(pos.x, pos.y, pos.size, pos.midBend, neckY, baseX),
          leafPaths: [
            this.getLeafPath(pos.x, pos.y, pos.size, 'left', neckY, baseX, pos.midBend, this.getJitter(f.id).leafL.t, this.getJitter(f.id).leafL.w),
            this.getLeafPath(pos.x, pos.y, pos.size, 'right', neckY, baseX, pos.midBend, this.getJitter(f.id).leafR.t, this.getJitter(f.id).leafR.w),
          ],
        };
      })
      .sort((a, b) => b.y - a.y);
  });

  readonly isBoxWrapping = computed(() => this.constructorService.selectedWrapping().id === 'box');
  readonly isKraftWrapping = computed(() => this.constructorService.selectedWrapping().id === 'kraft');
  readonly isOrganzaWrapping = computed(() => this.constructorService.selectedWrapping().id === 'organza');
  readonly showVase = computed(() => this.constructorService.selectedWrapping().id === 'none');
  readonly showRibbon = computed(() => this.constructorService.selectedRibbon().id !== 'none');

  private buildPositions(count: number, idOf: (i: number) => string): FlowerPosition[] {
    const positions: FlowerPosition[] = [];
    let placed = 0;

    for (const row of ROWS) {
      if (placed >= count) break;
      const inRow = Math.min(row.maxCount, count - placed);
      const rowY = VASE_TOP - row.yOffset;

      for (let i = 0; i < inRow; i++) {
        const frac = inRow === 1 ? 0.5 : i / (inRow - 1);
        const baseX = VASE_X - row.spread / 2 + frac * row.spread;
        const j = this.getJitter(idOf(placed));

        positions.push({
          x: baseX + j.dx,
          y: rowY + j.dy,
          rotation: j.rotation,
          size: placed < 4 ? 46 : placed < 12 ? 42 : 36,
          midBend: j.midBend,
        });
        placed++;
      }
    }

    return positions;
  }

  private getStemPath(fx: number, fy: number, size: number, midBend: number, neckY: number, baseX = VASE_X): string {
    const midX = (baseX + fx) / 2 + midBend;
    const midY = (neckY + fy) / 2 - 20;
    return `M ${baseX},${neckY} Q ${midX},${midY} ${fx},${fy + size * 0.4}`;
  }

  private getLeafPath(flowerX: number, flowerY: number, size: number, side: 'left' | 'right', neckY: number, baseX: number, midBend: number, t: number, w: number): string {
    // Evaluate point on the same quadratic bezier as the stem
    const midX = (baseX + flowerX) / 2 + midBend;
    const midY = (neckY + flowerY) / 2 - 20;
    const endY = flowerY + size * 0.4;
    const mt = 1 - t;
    const leafX = Math.round(mt * mt * baseX + 2 * mt * t * midX + t * t * flowerX);
    const leafY = Math.round(mt * mt * neckY + 2 * mt * t * midY + t * t * endY);
    const offset = side === 'left' ? -w : w;
    return `M ${leafX} ${leafY} Q ${Math.round(leafX + offset)} ${Math.round(leafY - w * 0.85)} ${Math.round(leafX + offset * 1.4)} ${Math.round(leafY + w * 0.37)} Q ${Math.round(leafX + offset * 0.4)} ${Math.round(leafY + w * 0.15)} ${leafX} ${leafY} Z`;
  }

  increment(flower: Flower): void {
    this.constructorService.addFlower(flower);
  }

  decrement(flower: Flower): void {
    this.constructorService.removeOneByFlowerId(flower.id);
  }

  removeAll(flower: Flower): void {
    this.constructorService.selectedFlowers.update((f) =>
      f.filter((item) => item.flower.id !== flower.id),
    );
  }

  clear(): void {
    this.constructorService.clear();
    this.jitterCache.clear();
  }
}
