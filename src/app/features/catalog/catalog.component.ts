import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Bouquet, BouquetService } from '../../core/services/bouquet.service';
import { BouquetHighlight } from '../../core/services/bouquet-highlight';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-catalog',
  imports: [RouterLink],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent {
  private readonly bouquetService = inject(BouquetService);
  private readonly highlight = inject(BouquetHighlight);
  private readonly cartService = inject(CartService);

  readonly bouquets = this.bouquetService.getAll();
  readonly highlightedId = this.highlight.highlightedId;
  readonly addedIds = signal<ReadonlySet<number>>(new Set());

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
