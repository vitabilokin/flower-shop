import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { ReminderService } from '../../../core/services/reminder.service';
import { Logo } from '../../../shared/components/logo/logo';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: 'catalog', label: 'Каталог', icon: 'inventory_2' },
  { path: 'season', label: 'Хіт сезону', icon: 'star' },
  { path: 'reminders', label: 'Нагадування', icon: 'notifications' },
  { path: 'settings', label: 'Налаштування', icon: 'settings' },
];

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, Logo],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly authService = inject(AuthService);
  private readonly reminderService = inject(ReminderService);
  private readonly router = inject(Router);

  readonly navItems = NAV_ITEMS;

  private readonly reminders = toSignal(this.reminderService.getReminders(), { initialValue: [] });
  readonly newReminderCount = computed(() => this.reminders().filter((r) => r.status === 'new').length);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly currentLabel = computed(() => {
    const url = this.url();
    return this.navItems.find((item) => url.includes(`/admin/${item.path}`))?.label ?? 'Адмін панель';
  });

  readonly today = new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

  readonly mobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
