import { Component, computed, inject } from '@angular/core';
import { ConstructorService, SelectedFlower } from '../../../../core/services/constructor.service';
import { FlowerIcon } from '../../../../shared/components/flower-icon/flower-icon';

interface PlacedFlower extends SelectedFlower {
  x: number;
  y: number;
  rotation: number;
}

@Component({
  selector: 'app-bouquet-canvas',
  imports: [FlowerIcon],
  templateUrl: './bouquet-canvas.html',
  styleUrl: './bouquet-canvas.scss',
})
export class BouquetCanvas {
  readonly constructorService = inject(ConstructorService);

  readonly placedFlowers = computed<PlacedFlower[]>(() => {
    const flowers = this.constructorService.selectedFlowers();
    const positions = this.getFlowerPositions(flowers.length);
    return flowers.map((f, i) => ({ ...f, ...positions[i] }));
  });

  readonly isEmpty = computed(() => this.constructorService.totalCount() === 0);
  readonly isBoxWrapping = computed(() => this.constructorService.selectedWrapping().id === 'box');
  readonly isKraftWrapping = computed(() => this.constructorService.selectedWrapping().id === 'kraft');
  readonly isOrganzaWrapping = computed(() => this.constructorService.selectedWrapping().id === 'organza');
  readonly showRibbon = computed(() => this.constructorService.selectedRibbon().id !== 'none');

  private getFlowerPositions(count: number): { x: number; y: number; rotation: number }[] {
    const positions = [];
    const centerX = 300;
    const baseY = 310;

    for (let i = 0; i < count; i++) {
      const angle = (i / Math.max(count - 1, 1)) * Math.PI - Math.PI / 2;
      const radius = 60 + Math.floor(i / 7) * 35;
      const x = centerX + Math.cos(angle) * radius * 0.8;
      const y = baseY + Math.sin(angle) * radius * 0.4 - 20;
      const rotation = (angle * 180) / Math.PI + 90;
      positions.push({ x, y, rotation });
    }
    return positions;
  }

  clear(): void {
    this.constructorService.selectedFlowers.set([]);
  }
}
