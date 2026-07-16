import { Component, computed, inject, signal } from '@angular/core';
import { CartService } from '../../../../core/services/cart.service';
import { ConstructorService, Flower } from '../../../../core/services/constructor.service';

interface GroupedFlower {
  flower: Flower;
  count: number;
  totalPrice: number;
}

@Component({
  standalone: true,
  selector: 'app-order-summary',
  imports: [],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss',
})
export class OrderSummary {
  readonly constructorService = inject(ConstructorService);
  private readonly cartService = inject(CartService);

  readonly addedToCart = signal(false);

  readonly groupedFlowers = computed<GroupedFlower[]>(() => {
    const groups = new Map<string, GroupedFlower>();
    for (const item of this.constructorService.selectedFlowers()) {
      const existing = groups.get(item.flower.id);
      if (existing) {
        existing.count += 1;
        existing.totalPrice += item.flower.price;
      } else {
        groups.set(item.flower.id, { flower: item.flower, count: 1, totalPrice: item.flower.price });
      }
    }
    return Array.from(groups.values());
  });

  readonly telegramUrl = computed(
    () => `https://t.me/${this.cartService.telegramUsername}?text=${this.constructorService.getTelegramMessage()}`,
  );
  readonly viberUrl = computed(
    () => `viber://chat?number=${this.cartService.viberPhone}&text=${this.constructorService.getViberMessage()}`,
  );

  addOne(flower: Flower): void {
    this.constructorService.addFlower(flower);
  }

  removeOne(flowerId: string): void {
    this.constructorService.removeOneByFlowerId(flowerId);
  }

  addToCart(): void {
    if (this.constructorService.totalCount() === 0) return;
    this.cartService.add({
      id: `custom-${Date.now()}`,
      name: 'Індивідуальний букет',
      price: this.constructorService.totalPrice(),
    });
    this.addedToCart.set(true);
    setTimeout(() => this.addedToCart.set(false), 1500);
  }
}
