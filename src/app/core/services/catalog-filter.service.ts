import { Injectable, computed, signal } from '@angular/core';
import { Bouquet } from './bouquet.service';
import { toMillis } from './firestore-helpers';

export type SortOption = 'popular' | 'cheap' | 'expensive' | 'new';

export const PRICE_MIN = 0;
export const PRICE_MAX = 100000;

@Injectable({ providedIn: 'root' })
export class CatalogFilterService {
  private readonly open = signal(false);

  readonly isOpen = this.open.asReadonly();

  readonly gridColumns = signal<2 | 3 | 4>(3);

  readonly sort = signal<SortOption>('popular');
  readonly occasions = signal<ReadonlySet<string>>(new Set());
  readonly types = signal<ReadonlySet<string>>(new Set());
  readonly colors = signal<ReadonlySet<string>>(new Set());
  readonly priceMin = signal<number>(PRICE_MIN);
  readonly priceMax = signal<number>(PRICE_MAX);

  readonly activeFilterCount = computed(
    () =>
      this.occasions().size +
      this.types().size +
      this.colors().size +
      (this.priceMin() !== PRICE_MIN ? 1 : 0) +
      (this.priceMax() !== PRICE_MAX ? 1 : 0),
  );

  openDrawer(): void {
    this.open.set(true);
  }

  closeDrawer(): void {
    this.open.set(false);
  }

  toggleDrawer(): void {
    this.open.update((v) => !v);
  }

  setGridColumns(columns: 2 | 3 | 4): void {
    this.gridColumns.set(columns);
  }

  setSort(sort: SortOption): void {
    this.sort.set(sort);
  }

  toggleOccasion(value: string): void {
    this.toggleInSet(this.occasions, value);
  }

  toggleType(value: string): void {
    this.toggleInSet(this.types, value);
  }

  toggleColor(value: string): void {
    this.toggleInSet(this.colors, value);
  }

  setPriceMin(value: number): void {
    this.priceMin.set(value);
  }

  setPriceMax(value: number): void {
    this.priceMax.set(value);
  }

  removeOccasion(value: string): void {
    this.removeFromSet(this.occasions, value);
  }

  removeType(value: string): void {
    this.removeFromSet(this.types, value);
  }

  removeColor(value: string): void {
    this.removeFromSet(this.colors, value);
  }

  resetPrice(): void {
    this.priceMin.set(PRICE_MIN);
    this.priceMax.set(PRICE_MAX);
  }

  resetAll(): void {
    this.sort.set('popular');
    this.occasions.set(new Set());
    this.types.set(new Set());
    this.colors.set(new Set());
    this.priceMin.set(PRICE_MIN);
    this.priceMax.set(PRICE_MAX);
  }

    applyFromQueryParams(params: {
    occasion?: string;
    type?: string;
    color?: string;
    sort?: string;
    min?: string;
    max?: string;
  }): void {
    this.occasions.set(params.occasion ? new Set(params.occasion.split(',')) : new Set());
    this.types.set(params.type ? new Set(params.type.split(',')) : new Set());
    this.colors.set(params.color ? new Set(params.color.split(',')) : new Set());
    this.sort.set((params.sort as SortOption) || 'popular');
    this.priceMin.set(params.min ? Number(params.min) : PRICE_MIN);
    this.priceMax.set(params.max ? Number(params.max) : PRICE_MAX);
  }

    toQueryParams(): Record<string, string | null> {
    return {
      occasion: this.occasions().size ? Array.from(this.occasions()).join(',') : null,
      type: this.types().size ? Array.from(this.types()).join(',') : null,
      color: this.colors().size ? Array.from(this.colors()).join(',') : null,
      sort: this.sort() !== 'popular' ? this.sort() : null,
      min: this.priceMin() !== PRICE_MIN ? String(this.priceMin()) : null,
      max: this.priceMax() !== PRICE_MAX ? String(this.priceMax()) : null,
    };
  }

    private matchesType(b: Bouquet, types: ReadonlySet<string>): boolean {
    if (!types.size) return true;
    if (types.has(b.type)) return true;
    return b.composition.some((c) => types.has(c.type));
  }

  private matchesStrict(b: Bouquet): boolean {
    const occasions = this.occasions();
    const colors = this.colors();
    if (occasions.size && !occasions.has(b.occasion)) return false;
    if (!this.matchesType(b, this.types())) return false;
    if (colors.size && !colors.has(b.color)) return false;
    if (b.price < this.priceMin() || b.price > this.priceMax()) return false;
    return true;
  }

    hasExactMatches(bouquets: Bouquet[]): boolean {
    return bouquets.some((b) => this.matchesStrict(b));
  }

  private sortBouquets(bouquets: Bouquet[]): Bouquet[] {
    const sorted = [...bouquets];
    switch (this.sort()) {
      case 'cheap':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'expensive':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'new':
        sorted.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
        break;
      default:
        sorted.sort((a, b) => {
          const aTop = a.tag === 'Хіт' || a.tag === 'Новинка' ? 1 : 0;
          const bTop = b.tag === 'Хіт' || b.tag === 'Новинка' ? 1 : 0;
          return bTop - aTop;
        });
    }
    return sorted;
  }

  
  apply(bouquets: Bouquet[]): Bouquet[] {
    const exact = bouquets.filter((b) => this.matchesStrict(b));
    if (exact.length > 0 || this.activeFilterCount() === 0) {
      return this.sortBouquets(exact);
    }

    const occasions = this.occasions();
    const types = this.types();
    const colors = this.colors();
    const min = this.priceMin();
    const max = this.priceMax();

    const scored = bouquets.map((b) => {
      let score = 0;
      if (occasions.size && occasions.has(b.occasion)) score++;
      if (types.size && this.matchesType(b, types)) score++;
      if (colors.size && colors.has(b.color)) score++;
      if (b.price >= min && b.price <= max) score++;
      return { b, score };
    });
    const bestScore = Math.max(...scored.map((s) => s.score));
    const closest = scored.filter((s) => s.score === bestScore).map((s) => s.b);
    return this.sortBouquets(closest);
  }

  private toggleInSet(sig: typeof this.occasions, value: string): void {
    sig.update((set) => {
      const next = new Set(set);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }

  private removeFromSet(sig: typeof this.occasions, value: string): void {
    sig.update((set) => {
      const next = new Set(set);
      next.delete(value);
      return next;
    });
  }
}
