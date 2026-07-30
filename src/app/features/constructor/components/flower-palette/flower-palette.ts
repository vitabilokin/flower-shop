import { Component, computed, inject, signal } from '@angular/core';
import {
  ConstructorService,
  Flower,
  FlowerType,
  Ribbon,
  Size,
  Wrapping,
} from '../../../../core/services/constructor.service';

type Tab = 'size' | 'flowers' | 'wrapping' | 'ribbon';

@Component({
  standalone: true,
  selector: 'app-flower-palette',
  templateUrl: './flower-palette.component.html',
  styleUrl: './flower-palette.component.scss',
})
export class FlowerPalette {
  readonly constructorService = inject(ConstructorService);

  readonly tabs: { id: Tab; label: string }[] = [
    { id: 'size', label: 'Розмір' },
    { id: 'flowers', label: 'Квіти' },
    { id: 'wrapping', label: 'Пакування' },
    { id: 'ribbon', label: 'Стрічка' },
  ];

  readonly activeTab = signal<Tab>('size');
  readonly openGroups = signal<ReadonlySet<FlowerType>>(new Set<FlowerType>(['rose']));

  readonly customMaxFlowers = signal(15);

  readonly flowerCounts = computed(() => {
    const counts: Record<string, number> = {};
    this.constructorService.selectedFlowers().forEach((f) => {
      counts[f.flower.id] = (counts[f.flower.id] ?? 0) + 1;
    });
    return counts;
  });

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  isGroupOpen(type: FlowerType): boolean {
    return this.openGroups().has(type);
  }

  toggleGroup(type: FlowerType): void {
    this.openGroups.update((set) => {
      const next = new Set(set);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  flowersOf(type: FlowerType): Flower[] {
    return this.constructorService.flowersByType(type);
  }

  getCount(flowerId: string): number {
    return this.flowerCounts()[flowerId] ?? 0;
  }

  increment(flower: Flower): void {
    if (this.constructorService.canAddMore()) {
      this.constructorService.addFlower(flower);
    }
  }

  decrement(flower: Flower): void {
    this.constructorService.removeOneByFlowerId(flower.id);
  }

  onCountChange(flower: Flower, event: Event): void {
    const value = Math.floor(+(event.target as HTMLInputElement).value);
    if (!Number.isFinite(value) || value < 0) return;
    const current = this.getCount(flower.id);
    const diff = value - current;
    if (diff > 0) {
      const max = this.constructorService.selectedSize().maxFlowers;
      const canAdd = Math.min(diff, max - this.constructorService.totalCount());
      for (let i = 0; i < canAdd; i++) this.constructorService.addFlower(flower);
    } else if (diff < 0) {
      for (let i = 0; i < -diff; i++) this.constructorService.removeOneByFlowerId(flower.id);
    }
  }

  applyCustomSize(): void {
    const count = Math.max(1, this.customMaxFlowers());
    this.constructorService.setSize({
      id: 'custom',
      name: 'Власний',
      maxFlowers: count,
      label: `до ${count} квіток`,
      multiplier: 1,
    });
    this.setTab('flowers');
  }

  incrementCustom(): void {
    this.customMaxFlowers.update((n) => n + 1);
    if (this.constructorService.selectedSize().id === 'custom') {
      this.applyCustomSizeNoSwitch();
    }
  }

  decrementCustom(): void {
    this.customMaxFlowers.update((n) => Math.max(1, n - 1));
    if (this.constructorService.selectedSize().id === 'custom') {
      this.applyCustomSizeNoSwitch();
    }
  }

  onCustomSizeChange(event: Event): void {
    const val = Math.max(1, Math.floor(+(event.target as HTMLInputElement).value));
    if (Number.isFinite(val) && val > 0) {
      this.customMaxFlowers.set(val);
      if (this.constructorService.selectedSize().id === 'custom') {
        this.applyCustomSizeNoSwitch();
      }
    }
  }

  private applyCustomSizeNoSwitch(): void {
    const count = Math.max(1, this.customMaxFlowers());
    this.constructorService.setSize({
      id: 'custom',
      name: 'Власний',
      maxFlowers: count,
      label: `до ${count} квіток`,
      multiplier: 1,
    });
  }

  selectWrapping(wrapping: Wrapping): void {
    this.constructorService.setWrapping(wrapping);
  }

  selectRibbon(ribbon: Ribbon): void {
    this.constructorService.setRibbon(ribbon);
  }

  selectSize(size: Size): void {
    this.constructorService.setSize(size);
    this.setTab('flowers');
  }
}
