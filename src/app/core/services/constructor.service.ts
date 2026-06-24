import { Injectable, computed, signal } from '@angular/core';

export type FlowerType = 'rose' | 'tulip' | 'sunflower' | 'peony' | 'lily' | 'orchid' | 'gerbera';

export interface Flower {
  id: string;
  name: string;
  type: FlowerType;
  color: string;
  price: number;
  petalColor: string;
  centerColor: string;
}

export interface SelectedFlower {
  flower: Flower;
  id: string;
}

export interface Wrapping {
  id: string;
  name: string;
  price: number;
  color: string;
  description: string;
}

export interface Ribbon {
  id: string;
  name: string;
  color: string;
}

export interface Size {
  id: string;
  name: string;
  maxFlowers: number;
  label: string;
  multiplier: number;
}

export const FLOWERS: Flower[] = [
  { id: 'rose-red', name: 'Троянда червона', type: 'rose', color: '#e53935', price: 85, petalColor: '#e53935', centerColor: '#ffcdd2' },
  { id: 'rose-pink', name: 'Троянда рожева', type: 'rose', color: '#f06292', price: 85, petalColor: '#f06292', centerColor: '#fce4ec' },
  { id: 'rose-white', name: 'Троянда біла', type: 'rose', color: '#f5f5f5', price: 90, petalColor: '#f5f5f5', centerColor: '#fff9c4' },
  { id: 'rose-yellow', name: 'Троянда жовта', type: 'rose', color: '#ffd740', price: 85, petalColor: '#ffd740', centerColor: '#fff9c4' },
  { id: 'tulip-pink', name: 'Тюльпан рожевий', type: 'tulip', color: '#f48fb1', price: 55, petalColor: '#f48fb1', centerColor: '#fce4ec' },
  { id: 'tulip-red', name: 'Тюльпан червоний', type: 'tulip', color: '#ef5350', price: 55, petalColor: '#ef5350', centerColor: '#ffcdd2' },
  { id: 'tulip-purple', name: 'Тюльпан фіолетовий', type: 'tulip', color: '#ab47bc', price: 60, petalColor: '#ab47bc', centerColor: '#f3e5f5' },
  { id: 'tulip-white', name: 'Тюльпан білий', type: 'tulip', color: '#eceff1', price: 55, petalColor: '#eceff1', centerColor: '#e3f2fd' },
  { id: 'sunflower', name: 'Соняшник', type: 'sunflower', color: '#ffd740', price: 65, petalColor: '#ffd740', centerColor: '#5d4037' },
  { id: 'peony-pink', name: 'Півонія рожева', type: 'peony', color: '#f48fb1', price: 120, petalColor: '#f48fb1', centerColor: '#fce4ec' },
  { id: 'peony-white', name: 'Півонія біла', type: 'peony', color: '#fafafa', price: 125, petalColor: '#fafafa', centerColor: '#fff9c4' },
  { id: 'peony-red', name: 'Півонія червона', type: 'peony', color: '#e53935', price: 120, petalColor: '#e53935', centerColor: '#ffcdd2' },
  { id: 'lily-white', name: 'Лілія біла', type: 'lily', color: '#f5f5f5', price: 95, petalColor: '#f5f5f5', centerColor: '#fff9c4' },
  { id: 'lily-orange', name: 'Лілія помаранчева', type: 'lily', color: '#ff7043', price: 95, petalColor: '#ff7043', centerColor: '#fff9c4' },
  { id: 'orchid-purple', name: 'Орхідея фіолетова', type: 'orchid', color: '#ce93d8', price: 150, petalColor: '#ce93d8', centerColor: '#f3e5f5' },
  { id: 'orchid-white', name: 'Орхідея біла', type: 'orchid', color: '#f5f5f5', price: 150, petalColor: '#f5f5f5', centerColor: '#e1bee7' },
  { id: 'gerbera-orange', name: 'Гербера помаранчева', type: 'gerbera', color: '#ff7043', price: 70, petalColor: '#ff7043', centerColor: '#ffd740' },
  { id: 'gerbera-pink', name: 'Гербера рожева', type: 'gerbera', color: '#f06292', price: 70, petalColor: '#f06292', centerColor: '#ffd740' },
];

export const WRAPPING: Wrapping[] = [
  { id: 'kraft', name: 'Крафт-папір', price: 50, color: '#d7ccc8', description: 'Натуральний крафт, еко-стиль' },
  { id: 'organza', name: 'Органза', price: 80, color: '#f8bbd0', description: 'Ніжна прозора тканина' },
  { id: 'box', name: 'Коробка', price: 120, color: '#ffcc80', description: 'Подарункова коробка з кришкою' },
  { id: 'none', name: 'Без упаковки', price: 0, color: 'transparent', description: 'Тільки стебла і зелень' },
];

export const RIBBONS: Ribbon[] = [
  { id: 'pink', name: 'Рожева', color: '#f06292' },
  { id: 'red', name: 'Червона', color: '#e53935' },
  { id: 'white', name: 'Біла', color: '#f5f5f5' },
  { id: 'gold', name: 'Золота', color: '#ffd740' },
  { id: 'green', name: 'Зелена', color: '#66bb6a' },
  { id: 'purple', name: 'Фіолетова', color: '#ab47bc' },
  { id: 'blue', name: 'Блакитна', color: '#42a5f5' },
  { id: 'none', name: 'Без стрічки', color: 'transparent' },
];

export const SIZES: Size[] = [
  { id: 'small', name: 'Маленький', maxFlowers: 5, label: 'до 5 квіток', multiplier: 1 },
  { id: 'medium', name: 'Середній', maxFlowers: 10, label: 'до 10 квіток', multiplier: 1.2 },
  { id: 'large', name: 'Великий', maxFlowers: 20, label: 'до 20 квіток', multiplier: 1.5 },
];

export const FLOWER_GROUPS: { type: FlowerType; label: string }[] = [
  { type: 'rose', label: 'Троянди' },
  { type: 'tulip', label: 'Тюльпани' },
  { type: 'sunflower', label: 'Соняшники' },
  { type: 'peony', label: 'Півонії' },
  { type: 'lily', label: 'Лілії' },
  { type: 'orchid', label: 'Орхідеї' },
  { type: 'gerbera', label: 'Гербери' },
];

@Injectable({ providedIn: 'root' })
export class ConstructorService {
  readonly flowers = FLOWERS;
  readonly wrappingOptions = WRAPPING;
  readonly ribbonOptions = RIBBONS;
  readonly sizeOptions = SIZES;
  readonly flowerGroups = FLOWER_GROUPS;

  readonly selectedFlowers = signal<SelectedFlower[]>([]);
  readonly selectedWrapping = signal<Wrapping>(WRAPPING[0]);
  readonly selectedRibbon = signal<Ribbon>(RIBBONS[0]);
  readonly selectedSize = signal<Size>(SIZES[1]);

  readonly totalPrice = computed(() => {
    const flowers = this.selectedFlowers().reduce((sum, f) => sum + f.flower.price, 0);
    return flowers + this.selectedWrapping().price;
  });

  readonly totalCount = computed(() => this.selectedFlowers().length);

  readonly canAddMore = computed(() => this.selectedFlowers().length < this.selectedSize().maxFlowers);

  flowersByType(type: FlowerType): Flower[] {
    return this.flowers.filter((f) => f.type === type);
  }

  addFlower(flower: Flower): void {
    if (!this.canAddMore()) return;
    const id = `${flower.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.selectedFlowers.update((f) => [...f, { flower, id }]);
  }

  readonly removingIds = signal<ReadonlySet<string>>(new Set());

  removeFlower(id: string): void {
    this.selectedFlowers.update((f) => f.filter((item) => item.id !== id));
  }

  /** Marks a flower as leaving so the canvas can play a shrink/fade-out animation before it's actually removed. */
  requestRemove(id: string): void {
    if (this.removingIds().has(id)) return;
    this.removingIds.update((set) => new Set(set).add(id));
    setTimeout(() => {
      this.removeFlower(id);
      this.removingIds.update((set) => {
        const next = new Set(set);
        next.delete(id);
        return next;
      });
    }, 300);
  }

  removeOneByFlowerId(flowerId: string): void {
    const items = this.selectedFlowers();
    const lastMatch = [...items].reverse().find((item) => item.flower.id === flowerId && !this.removingIds().has(item.id));
    if (lastMatch) {
      this.requestRemove(lastMatch.id);
    }
  }

  setWrapping(wrapping: Wrapping): void {
    this.selectedWrapping.set(wrapping);
  }

  setRibbon(ribbon: Ribbon): void {
    this.selectedRibbon.set(ribbon);
  }

  setSize(size: Size): void {
    this.selectedSize.set(size);
    if (this.selectedFlowers().length > size.maxFlowers) {
      this.selectedFlowers.update((f) => f.slice(0, size.maxFlowers));
    }
  }

  clear(): void {
    this.selectedFlowers.set([]);
    this.selectedWrapping.set(WRAPPING[0]);
    this.selectedRibbon.set(RIBBONS[0]);
  }

  getTelegramMessage(): string {
    const flowers = this.selectedFlowers();
    const counts: Record<string, number> = {};
    flowers.forEach((f) => {
      counts[f.flower.name] = (counts[f.flower.name] || 0) + 1;
    });
    const flowerList = Object.entries(counts)
      .map(([name, count]) => `— ${name} × ${count}`)
      .join('\n');
    return encodeURIComponent(
      `Привіт! Хочу замовити індивідуальний букет:\n` +
        `${flowerList}\n` +
        `Упаковка: ${this.selectedWrapping().name}\n` +
        `Стрічка: ${this.selectedRibbon().name}\n` +
        `Загальна ціна: ${this.totalPrice()} грн`,
    );
  }

  getViberMessage(): string {
    return this.getTelegramMessage();
  }
}
