import { Component, inject } from '@angular/core';
import { BouquetHighlight } from '../../services/bouquet-highlight';
import { Toast } from '../../services/toast';

export interface Bouquet {
  id: number;
  name: string;
  price: number;
  hue: [string, string];
  tag?: string;
  tagTone?: 'pink' | 'teal' | 'spark';
}

const BOUQUETS: Bouquet[] = [
  { id: 1, name: 'Ніжність', price: 850, hue: ['#ff7eb0', '#ff4d8d'], tag: 'Хіт', tagTone: 'pink' },
  { id: 2, name: 'Пристрасть', price: 1200, hue: ['#ff4d8d', '#c2185b'] },
  { id: 3, name: 'Спокій', price: 950, hue: ['#5fd6cb', '#07b3a3'], tag: 'Сезонне', tagTone: 'teal' },
  { id: 4, name: 'Сонячний день', price: 780, hue: ['#ffd84d', '#ff8a1e'] },
  { id: 5, name: 'Романтика', price: 1450, hue: ['#ff7eb0', '#7b2ff7'] },
  { id: 6, name: 'Свіжість', price: 690, hue: ['#6fce8f', '#07b3a3'] },
  { id: 7, name: 'Лавандові мрії', price: 1100, hue: ['#c4a3ff', '#7b2ff7'] },
  { id: 8, name: 'Перше побачення', price: 990, hue: ['#ff9cbf', '#ff4d8d'], tag: 'Новинка', tagTone: 'spark' },
  { id: 9, name: 'Дякую', price: 720, hue: ['#ffd84d', '#07b3a3'] },
];

@Component({
  selector: 'app-catalog',
  imports: [],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog {
  private readonly highlight = inject(BouquetHighlight);
  private readonly toast = inject(Toast);

  readonly bouquets = BOUQUETS;
  readonly highlightedId = this.highlight.highlightedId;

  gradient(b: Bouquet): string {
    return `linear-gradient(135deg, ${b.hue[0]}, ${b.hue[1]})`;
  }

  order(b: Bouquet): void {
    this.toast.show(`Дякуємо! Букет «${b.name}» додано до замовлення 🌸`);
  }
}
