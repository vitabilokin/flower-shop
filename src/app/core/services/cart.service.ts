import { Injectable, computed, inject, signal } from '@angular/core';
import { SettingsService } from './settings.service';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartAddable {
  id: string;
  name: string;
  price: number;
  photo?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly settingsService = inject(SettingsService);

  private readonly items = signal<CartItem[]>([]);
  private readonly open = signal(false);

  readonly cartItems = this.items.asReadonly();
  readonly isOpen = this.open.asReadonly();

  readonly totalCount = computed(() => this.items().reduce((sum, i) => sum + i.quantity, 0));

  readonly totalPrice = computed(() => this.items().reduce((sum, i) => sum + i.price * i.quantity, 0));

  get telegramUsername(): string {
    return this.settingsService.settings().telegram.replace('@', '');
  }

  get viberPhone(): string {
    return this.settingsService.settings().viber;
  }

  add(bouquet: CartAddable): void {
    const existing = this.items().find((i) => i.id === bouquet.id);
    if (existing) {
      this.items.update((items) =>
        items.map((i) => (i.id === bouquet.id ? { ...i, quantity: i.quantity + 1 } : i)),
      );
    } else {
      this.items.update((items) => [
        ...items,
        { id: bouquet.id, name: bouquet.name, price: bouquet.price, quantity: 1, imageUrl: bouquet.photo },
      ]);
    }
  }

  remove(id: string): void {
    this.items.update((items) => items.filter((i) => i.id !== id));
  }

  updateQuantity(id: string, quantity: number): void {
    if (quantity <= 0) {
      this.remove(id);
      return;
    }
    this.items.update((items) => items.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }

  clear(): void {
    this.items.set([]);
  }

  openDrawer(): void {
    this.open.set(true);
  }

  closeDrawer(): void {
    this.open.set(false);
  }

  toggleDrawer(): void {
    this.open.update((v) => !v);
  }

  getTelegramMessage(): string {
    const lines = this.items().map((i) => `— "${i.name}" × ${i.quantity} — ${i.price * i.quantity} грн`);
    return encodeURIComponent(`Привіт! Хочу замовити:\n${lines.join('\n')}\nРазом: ${this.totalPrice()} грн`);
  }

  getViberMessage(): string {
    return this.getTelegramMessage();
  }

  getSingleItemMessage(bouquet: CartAddable): string {
    return encodeURIComponent(
      `Привіт! Хочу замовити:\n— "${bouquet.name}" × 1 — ${bouquet.price} грн\nРазом: ${bouquet.price} грн`,
    );
  }
}
