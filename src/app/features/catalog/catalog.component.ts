import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Bouquet, BouquetService, ColorOption, FilterOption } from '../../core/services/bouquet.service';
import { BouquetHighlight } from '../../core/services/bouquet-highlight';
import { CartService } from '../../core/services/cart.service';
import { CatalogFilterService, PRICE_MAX, PRICE_MIN } from '../../core/services/catalog-filter.service';
import { FilterDrawer } from '../../shared/components/filter-drawer/filter-drawer';

interface FilterChip {
  label: string;
  remove: () => void;
}

@Component({
  selector: 'app-catalog',
  imports: [RouterLink, FilterDrawer],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent {
  private readonly bouquetService = inject(BouquetService);
  private readonly highlight = inject(BouquetHighlight);
  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly filterService = inject(CatalogFilterService);

  // Reads BouquetService's Firestore-backed signal, so this stays current once data
  // arrives (the bouquet list is empty for an instant on first load).
  private readonly allBouquets = computed(() => this.bouquetService.getAll());
  private readonly occasionOptions = this.bouquetService.getOccasionOptions();
  private readonly typeOptions = this.bouquetService.getTypeOptions();
  private readonly colorOptions = this.bouquetService.getColorOptions();

  readonly bouquets = computed(() => this.filterService.apply(this.allBouquets()));
  readonly highlightedId = this.highlight.highlightedId;
  readonly addedIds = signal<ReadonlySet<string>>(new Set());

  // True when nothing matches every active filter exactly, so the shown bouquets are the
  // closest fallback rather than a real match — lets the template explain the substitution.
  readonly isFallback = computed(
    () =>
      this.filterService.activeFilterCount() > 0 &&
      this.bouquets().length > 0 &&
      !this.filterService.hasExactMatches(this.allBouquets()),
  );

  readonly activeChips = computed<FilterChip[]>(() => {
    const chips: FilterChip[] = [];

    for (const value of this.filterService.occasions()) {
      const opt = this.findOption(this.occasionOptions, value);
      chips.push({ label: opt?.label ?? value, remove: () => this.filterService.removeOccasion(value) });
    }
    for (const value of this.filterService.types()) {
      const opt = this.findOption(this.typeOptions, value);
      chips.push({ label: opt?.label ?? value, remove: () => this.filterService.removeType(value) });
    }
    for (const value of this.filterService.colors()) {
      const opt = this.findOption(this.colorOptions, value);
      chips.push({ label: opt?.label ?? value, remove: () => this.filterService.removeColor(value) });
    }
    if (this.filterService.priceMin() !== PRICE_MIN || this.filterService.priceMax() !== PRICE_MAX) {
      chips.push({
        label: `${this.filterService.priceMin()}–${this.filterService.priceMax()} грн`,
        remove: () => this.filterService.resetPrice(),
      });
    }
    return chips;
  });

  private isApplyingFromUrl = true;

  constructor() {
    const params = this.route.snapshot.queryParamMap;
    this.filterService.applyFromQueryParams({
      occasion: params.get('occasion') ?? undefined,
      type: params.get('type') ?? undefined,
      color: params.get('color') ?? undefined,
      sort: params.get('sort') ?? undefined,
      min: params.get('min') ?? undefined,
      max: params.get('max') ?? undefined,
    });
    this.isApplyingFromUrl = false;

    effect(() => {
      // touch all filter signals so this effect reruns on every change
      const queryParams = this.filterService.toQueryParams();
      if (this.isApplyingFromUrl) {
        return;
      }
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        replaceUrl: true,
      });
    });
  }

  private findOption(options: FilterOption[] | ColorOption[], value: string): FilterOption | undefined {
    return options.find((o) => o.value === value);
  }

  setColumns(columns: 2 | 3 | 4): void {
    this.filterService.setGridColumns(columns);
  }

  toggleFilters(): void {
    if (!this.filterService.isOpen()) {
      this.cartService.closeDrawer();
    }
    this.filterService.toggleDrawer();
  }

  isOutOfStock(b: Bouquet): boolean {
    return b.status === 'out_of_stock';
  }

  addToCart(b: Bouquet): void {
    if (this.isOutOfStock(b)) return;
    this.cartService.add(b);
    this.addedIds.update((ids) => new Set(ids).add(b.id));
    setTimeout(() => {
      this.addedIds.update((ids) => {
        const next = new Set(ids);
        next.delete(b.id);
        return next;
      });
    }, 1500);
  }

  quickOrder(b: Bouquet): void {
    if (this.isOutOfStock(b)) return;
    const msg = this.cartService.getSingleItemMessage(b);
    window.open(`https://t.me/${this.cartService.telegramUsername}?text=${msg}`, '_blank');
  }
}
