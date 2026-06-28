import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../../core/services/settings.service';

@Component({
  selector: 'app-contacts',
  imports: [RouterLink],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
  readonly settingsService = inject(SettingsService);

  readonly telHref = computed(() => `tel:${this.settingsService.settings().phone.replace(/[^\d+]/g, '')}`);
  readonly viberHref = computed(() => `viber://chat?number=${this.settingsService.settings().viber}`);
  readonly telegramHref = computed(() => `https://t.me/${this.settingsService.settings().telegram.replace('@', '')}`);
  readonly instagramHref = computed(() => `https://instagram.com/${this.settingsService.settings().instagram.replace('@', '')}`);
}
