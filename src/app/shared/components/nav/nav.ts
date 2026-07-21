import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { CatalogFilterService } from '../../../core/services/catalog-filter.service';
import { Logo } from '../logo/logo';

@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, Logo],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class Nav {
  private readonly router = inject(Router);
  private readonly filterService = inject(CatalogFilterService);
  readonly cartService = inject(CartService);

  readonly scrolled = signal(false);
  readonly isHome = signal(this.router.url === '/');
  readonly badgeBump = signal(false);
  readonly menuOpen = signal(false);

  readonly solid = computed(() => this.scrolled() || !this.isHome());

  private previousCount = 0;
  private bumpTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.isHome.set(this.router.url === '/');
      this.menuOpen.set(false);
    });

    effect(() => {
      const count = this.cartService.totalCount();
      if (count > this.previousCount) {
        clearTimeout(this.bumpTimeout);
        this.badgeBump.set(false);
        requestAnimationFrame(() => {
          this.badgeBump.set(true);
          this.bumpTimeout = setTimeout(() => this.badgeBump.set(false), 200);
        });
      }
      this.previousCount = count;
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }

  toggleCart(): void {
    if (!this.cartService.isOpen()) {
      this.filterService.closeDrawer();
    }
    this.cartService.toggleDrawer();
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
