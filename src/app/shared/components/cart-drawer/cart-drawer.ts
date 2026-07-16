import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem, CartService } from '../../../core/services/cart.service';

@Component({
  standalone: true,
  selector: 'app-cart-drawer',
  imports: [RouterLink],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.scss',
})
export class CartDrawer {
  readonly cartService = inject(CartService);

  readonly closing = signal(false);

  readonly telegramUrl = (msg: string) => `https://t.me/${this.cartService.telegramUsername}?text=${msg}`;
  readonly viberUrl = (msg: string) =>
    `viber://chat?number=${this.cartService.viberPhone}&text=${msg}`;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.requestClose();
  }

  increment(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decrement(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity - 1);
  }

  remove(item: CartItem): void {
    this.cartService.remove(item.id);
  }

  requestClose(): void {
    if (this.closing()) {
      return;
    }
    this.closing.set(true);
    setTimeout(() => this.cartService.closeDrawer(), 280);
  }
}
