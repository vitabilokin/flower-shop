import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './shared/components/nav/nav';
import { Footer } from './shared/components/footer/footer';
import { ToastComponent } from './shared/components/toast/toast';
import { CartDrawer } from './shared/components/cart-drawer/cart-drawer';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Footer, ToastComponent, CartDrawer],
  template: `
    <app-nav />
    <main>
      <router-outlet />
    </main>
    <app-footer />
    <app-toast />
    @if (cartService.isOpen()) {
      <app-cart-drawer />
    }
  `,
})
export class App {
  readonly cartService = inject(CartService);
}
