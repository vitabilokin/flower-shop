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
const VASE_NECK_Y = 435;

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

  private readonly jitterCache = new Map<string, { dx: number; dy: number; rotation: number; midBend: number }>();

  private getJitter(id: string) {
    let j = this.jitterCache.get(id);
    if (!j) {
      j = {
        dx: (Math.random() - 0.5) * 22,
        dy: (Math.random() - 0.5) * 18,
        rotation: (Math.random() - 0.5) * 40,
        midBend: (Math.random() - 0.5) * 15,
      };
      this.jitterCache.set(id, j);
    }
    return j;
  }

  readonly placedFlowers = computed<PlacedFlower[]>(() => {
    const flowers = this.constructorService.selectedFlowers();
    const visible = flowers.slice(0, 28);
    const positions = this.buildPositions(visible.length, (i) => visible[i].id);

    return visible
      .map((f, i) => {
        const pos = positions[i];
        return {
          ...f,
          x: pos.x,
          y: pos.y,
          rotation: pos.rotation,
          size: pos.size,
          stemPath: this.getStemPath(pos.x, pos.y, pos.size, pos.midBend),
          leafPaths: [this.getLeafPath(pos.x, pos.y, 'left'), this.getLeafPath(pos.x, pos.y, 'right')],
        };
      })
      .sort((a, b) => b.y - a.y);
  });

  readonly isBoxWrapping = computed(() => this.constructorService.selectedWrapping().id === 'box');
  readonly isKraftWrapping = computed(() => this.constructorService.selectedWrapping().id === 'kraft');
  readonly isOrganzaWrapping = computed(() => this.constructorService.selectedWrapping().id === 'organza');
  readonly showVase = computed(() => !this.isKraftWrapping() && !this.isBoxWrapping());
  readonly showRibbon = computed(() => this.constructorService.selectedRibbon().id !== 'none');
  readonly showGeneralRibbon = computed(() => this.showRibbon() && this.showVase());

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

  private getStemPath(fx: number, fy: number, size: number, midBend: number): string {
    const midX = (VASE_X + fx) / 2 + midBend;
    const midY = (VASE_NECK_Y + fy) / 2 - 20;
    return `M ${VASE_X},${VASE_NECK_Y} Q ${midX},${midY} ${fx},${fy + size * 0.4}`;
  }

  private getLeafPath(flowerX: number, flowerY: number, side: 'left' | 'right'): string {
    const midX = (VASE_X + flowerX) / 2;
    const midY = (VASE_NECK_Y + flowerY) / 2;
    const offset = side === 'left' ? -20 : 20;
    return `M ${midX} ${midY} Q ${midX + offset} ${midY - 16} ${midX + offset * 1.4} ${midY + 7} Q ${midX + offset * 0.4} ${midY + 3} ${midX} ${midY} Z`;
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
    this.constructorService.selectedFlowers.set([]);
    this.jitterCache.clear();
  }
}
