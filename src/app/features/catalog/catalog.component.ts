import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Bouquet, BouquetService, ColorOption, FilterOption } from '../../core/services/bouquet.service';
import { BouquetHighlight } from '../../core/services/bouquet-highlight';
import { CartService } from '../../core/services/cart.service';
import { CatalogFilterService } from '../../core/services/catalog-filter.service';
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

  private readonly allBouquets = this.bouquetService.getAll();
  private readonly occasionOptions = this.bouquetService.getOccasionOptions();
  private readonly typeOptions = this.bouquetService.getTypeOptions();
  private readonly colorOptions = this.bouquetService.getColorOptions();

  readonly bouquets = computed(() => this.filterService.apply(this.allBouquets));
  readonly highlightedId = this.highlight.highlightedId;
  readonly addedIds = signal<ReadonlySet<number>>(new Set());

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
    if (this.filterService.priceMin() !== 0 || this.filterService.priceMax() !== 2000) {
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

  addToCart(b: Bouquet): void {
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
    const msg = this.cartService.getSingleItemMessage(b);
    window.open(`https://t.me/${this.cartService.telegramUsername}?text=${msg}`, '_blank');
  }
}
