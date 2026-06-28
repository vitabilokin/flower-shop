import { Component, computed, inject } from '@angular/core';
import { ConstructorService, SelectedFlower } from '../../../../core/services/constructor.service';

interface FlowerPosition {
  x: number;
  y: number;
  rotation: number;
  radius: number;
}

interface PlacedFlower extends SelectedFlower {
  x: number;
  y: number;
  rotation: number;
  radius: number;
  stemPath: string;
  leafPaths: string[];
}

const VASE_X = 300;
const VASE_TOP_Y = 430;
// Keeps the topmost row's blooms (radius + jitter included) from poking above y=0.
const MAX_BOUQUET_HEIGHT = 330;

@Component({
  selector: 'app-bouquet-canvas',
  templateUrl: './bouquet-canvas.html',
  styleUrl: './bouquet-canvas.scss',
})
export class BouquetCanvas {
  readonly constructorService = inject(ConstructorService);

  // Jitter must stay the same for a given flower instance across re-renders (e.g. when
  // another flower is added/removed), otherwise already-placed flowers would visibly
  // "jump" every time the bouquet changes. Cached here, keyed by the flower's stable id.
  private readonly jitterCache = new Map<string, { dx: number; dy: number }>();

  private getJitter(id: string): { dx: number; dy: number } {
    let jitter = this.jitterCache.get(id);
    if (!jitter) {
      jitter = { dx: (Math.random() - 0.5) * 14, dy: (Math.random() - 0.5) * 10 };
      this.jitterCache.set(id, jitter);
    }
    return jitter;
  }

  readonly placedFlowers = computed<PlacedFlower[]>(() => {
    const flowers = this.constructorService.selectedFlowers();
    const positions = this.getFlowerPositions(flowers, (f) => f.id);

    const placed = flowers.map((f, i) => {
      const pos = positions[i];
      return {
        ...f,
        x: pos.x,
        y: pos.y,
        rotation: pos.rotation,
        radius: pos.radius,
        stemPath: this.getStemPath(pos.x, pos.y, pos.radius),
        leafPaths: [this.getLeafPath(pos.x, pos.y, 'left'), this.getLeafPath(pos.x, pos.y, 'right')],
      };
    });

    // Lower (larger Y) flowers are drawn first so higher ones layer naturally on top.
    return placed.sort((a, b) => b.y - a.y);
  });

  readonly isEmpty = computed(() => this.constructorService.totalCount() === 0);
  readonly isBoxWrapping = computed(() => this.constructorService.selectedWrapping().id === 'box');
  readonly isKraftWrapping = computed(() => this.constructorService.selectedWrapping().id === 'kraft');
  readonly isOrganzaWrapping = computed(() => this.constructorService.selectedWrapping().id === 'organza');
  readonly showRibbon = computed(() => this.constructorService.selectedRibbon().id !== 'none');

  private getFlowerPositions<T>(items: T[], idOf: (item: T) => string): FlowerPosition[] {
    const count = items.length;
    if (count === 0) return [];

    const centerX = VASE_X;
    const totalRows = Math.max(1, Math.ceil(count / 4));
    const rowHeight = Math.min(85, MAX_BOUQUET_HEIGHT / totalRows);

    const rows = Array.from({ length: totalRows }, (_, r) => ({
      y: VASE_TOP_Y - 70 - r * rowHeight,
      maxCount: 4,
      spread: Math.max(60, 160 - r * 15),
      radius: r === 0 ? 35 : r === 1 ? 32 : 28,
    }));

    const positions: FlowerPosition[] = [];
    let placed = 0;
    for (const row of rows) {
      if (placed >= count) break;

      const inRow = Math.min(row.maxCount, count - placed);
      for (let i = 0; i < inRow; i++) {
        const fraction = inRow === 1 ? 0.5 : i / (inRow - 1);
        const baseX = centerX - row.spread / 2 + fraction * row.spread;
        const jitter = this.getJitter(idOf(items[placed]));

        positions.push({
          x: baseX + jitter.dx,
          y: row.y + jitter.dy,
          rotation: (placed % 2 === 0 ? 1 : -1) * (5 + (placed * 7) % 15),
          radius: row.radius,
        });
        placed++;
      }
    }

    return positions;
  }

  private getStemPath(flowerX: number, flowerY: number, radius: number): string {
    const endY = flowerY + radius * 0.9;
    const cp1x = VASE_X + (flowerX - VASE_X) * 0.2;
    const cp1y = VASE_TOP_Y - 30;
    const cp2x = flowerX - (flowerX - VASE_X) * 0.1;
    const cp2y = endY + 50;
    return `M ${VASE_X},${VASE_TOP_Y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${flowerX},${endY}`;
  }

  private getLeafPath(flowerX: number, flowerY: number, side: 'left' | 'right'): string {
    const midX = (VASE_X + flowerX) / 2;
    const midY = (VASE_TOP_Y + flowerY) / 2;
    const offset = side === 'left' ? -25 : 25;

    return `M ${midX} ${midY} Q ${midX + offset} ${midY - 20} ${midX + offset * 1.5} ${midY + 10} Q ${midX + offset * 0.5} ${midY + 5} ${midX} ${midY} Z`;
  }

  clear(): void {
    this.constructorService.selectedFlowers.set([]);
    this.jitterCache.clear();
  }
}
