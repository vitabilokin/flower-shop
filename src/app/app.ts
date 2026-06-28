import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { Nav } from './shared/components/nav/nav';
import { Footer } from './shared/components/footer/footer';
import { ToastComponent } from './shared/components/toast/toast';
import { CartDrawer } from './shared/components/cart-drawer/cart-drawer';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Footer, ToastComponent, CartDrawer],
  template: `
    @if (!isAdminRoute()) {
      <app-nav />
    }
    <main>
      <router-outlet />
    </main>
    @if (!isAdminRoute()) {
      <app-footer />
      <app-toast />
      @if (cartService.isOpen()) {
        <app-cart-drawer />
      }
    }
  `,
})
export class App {
  readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly isAdminRoute = computed(() => this.url().startsWith('/admin'));
}
