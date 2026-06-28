import { Component, inject, signal } from '@angular/core';
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
  selector: 'app-flower-palette',
  templateUrl: './flower-palette.html',
  styleUrl: './flower-palette.scss',
})
export class FlowerPalette {
  readonly constructorService = inject(ConstructorService);

  readonly tabs: { id: Tab; label: string }[] = [
    { id: 'size', label: 'Розмір' },
    { id: 'flowers', label: 'Квіти' },
    { id: 'wrapping', label: 'Упаковка' },
    { id: 'ribbon', label: 'Стрічка' },
  ];

  readonly activeTab = signal<Tab>('size');
  readonly openGroups = signal<ReadonlySet<FlowerType>>(new Set<FlowerType>(['rose']));

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

  addFlower(flower: Flower): void {
    this.constructorService.addFlower(flower);
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
