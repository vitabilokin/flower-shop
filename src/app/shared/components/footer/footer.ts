import { Component, computed, inject } from '@angular/core';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly year = new Date().getFullYear();
  readonly settingsService = inject(SettingsService);

  readonly telHref = computed(() => `tel:${this.settingsService.settings().phone.replace(/[^\d+]/g, '')}`);
  readonly instagramHref = computed(() => `https://instagram.com/${this.settingsService.settings().instagram.replace('@', '')}`);
  readonly telegramHref = computed(() => `https://t.me/${this.settingsService.settings().telegram.replace('@', '')}`);
}
