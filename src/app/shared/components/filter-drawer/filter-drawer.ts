import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BouquetService } from '../../../core/services/bouquet.service';
import { CatalogFilterService, PRICE_MAX, PRICE_MIN, SortOption } from '../../../core/services/catalog-filter.service';

type Section = 'sort' | 'occasion' | 'type' | 'price' | 'color';

@Component({
  selector: 'app-filter-drawer',
  imports: [FormsModule],
  templateUrl: './filter-drawer.html',
  styleUrl: './filter-drawer.scss',
})
export class FilterDrawer {
  readonly filterService = inject(CatalogFilterService);
  private readonly bouquetService = inject(BouquetService);

  readonly closing = signal(false);
  readonly openSections = signal<ReadonlySet<Section>>(new Set<Section>(['price']));

  readonly sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popular', label: 'За популярністю' },
    { value: 'cheap', label: 'Спочатку дешевші' },
    { value: 'expensive', label: 'Спочатку дорожчі' },
    { value: 'new', label: 'Новинки' },
  ];

  readonly occasionOptions = this.bouquetService.getOccasionOptions();
  readonly typeOptions = this.bouquetService.getTypeOptions();
  readonly colorOptions = this.bouquetService.getColorOptions();

  readonly priceMinLimit = PRICE_MIN;
  readonly priceMaxLimit = PRICE_MAX;

  readonly minPercent = computed(
    () => ((this.filterService.priceMin() - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100,
  );
  readonly maxPercent = computed(
    () => ((this.filterService.priceMax() - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100,
  );

  readonly resultCount = computed(() => this.filterService.apply(this.bouquetService.getAll()).length);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.requestClose();
  }

  isSectionOpen(section: Section): boolean {
    return this.openSections().has(section);
  }

  toggleSection(section: Section): void {
    this.openSections.update((set) => {
      const next = new Set(set);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  }

  onPriceMinChange(value: number): void {
    const clamped = Math.min(Math.max(value, this.priceMinLimit), this.filterService.priceMax());
    this.filterService.setPriceMin(clamped);
  }

  onPriceMaxChange(value: number): void {
    const clamped = Math.max(Math.min(value, this.priceMaxLimit), this.filterService.priceMin());
    this.filterService.setPriceMax(clamped);
  }

  resetAll(): void {
    this.filterService.resetAll();
  }

  showResults(): void {
    this.requestClose();
  }

  requestClose(): void {
    if (this.closing()) {
      return;
    }
    this.closing.set(true);
    setTimeout(() => this.filterService.closeDrawer(), 280);
  }
}
