import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BouquetService } from '../../../core/services/bouquet.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-bouquet-detail',
  imports: [RouterLink],
  templateUrl: './bouquet-detail.component.html',
  styleUrl: './bouquet-detail.component.scss',
})
export class BouquetDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly bouquetService = inject(BouquetService);
  private readonly cartService = inject(CartService);

  readonly bouquet = this.bouquetService.getById(Number(this.route.snapshot.paramMap.get('id')));
  readonly added = signal(false);

  addToCart(): void {
    if (!this.bouquet) {
      return;
    }
    this.cartService.add(this.bouquet);
    this.added.set(true);
    setTimeout(() => this.added.set(false), 1500);
  }

  quickOrder(): void {
    if (!this.bouquet) {
      return;
    }
    const msg = this.cartService.getSingleItemMessage(this.bouquet);
    window.open(`https://t.me/${this.cartService.telegramUsername}?text=${msg}`, '_blank');
  }
}
