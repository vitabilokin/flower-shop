import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BouquetService } from '../../../core/services/bouquet.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  standalone: true,
  selector: 'app-bouquet-detail',
  imports: [RouterLink],
  templateUrl: './bouquet-detail.component.html',
  styleUrl: './bouquet-detail.component.scss',
})
export class BouquetDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly bouquetService = inject(BouquetService);
  private readonly cartService = inject(CartService);

  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  private readonly typeOptions = this.bouquetService.getTypeOptions();

  readonly bouquet = computed(() => this.bouquetService.getById(this.id));
  readonly isOutOfStock = computed(() => this.bouquet()?.status === 'out_of_stock');
  readonly added = signal(false);

  typeLabel(type: string): string {
    return this.typeOptions.find((o) => o.value === type)?.label ?? type;
  }

  addToCart(): void {
    const bouquet = this.bouquet();
    if (!bouquet || this.isOutOfStock()) {
      return;
    }
    this.cartService.add(bouquet);
    this.added.set(true);
    setTimeout(() => this.added.set(false), 1500);
  }

  quickOrder(): void {
    const bouquet = this.bouquet();
    if (!bouquet || this.isOutOfStock()) {
      return;
    }
    const msg = this.cartService.getSingleItemMessage(bouquet);
    window.open(`https://t.me/${this.cartService.telegramUsername}?text=${msg}`, '_blank');
  }
}
