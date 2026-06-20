import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);
  readonly cartService = inject(CartService);

  readonly scrolled = signal(false);
  readonly isHome = signal(this.router.url === '/');
  readonly badgeBump = signal(false);

  // Solid (ivory) header everywhere except the home page's transparent hero overlay.
  readonly solid = computed(() => this.scrolled() || !this.isHome());

  readonly sectionLinks = [
    { id: 'about', label: 'Про нас' },
    { id: 'contacts', label: 'Контакти' },
  ];

  private previousCount = 0;
  private bumpTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.isHome.set(this.router.url === '/');
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

  goToSection(id: string): void {
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      this.viewportScroller.scrollToAnchor(id);
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.viewportScroller.scrollToAnchor(id));
      });
    }
  }

  toggleCart(): void {
    this.cartService.toggleDrawer();
  }
}
