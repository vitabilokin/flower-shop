import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DEFAULT_SETTINGS, SettingsService, SiteSettings } from '../../../core/services/settings.service';
import { BouquetService } from '../../../core/services/bouquet.service';
import { seedDatabase } from '../../../core/scripts/seed';

@Component({
  selector: 'app-admin-settings',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly bouquetService = inject(BouquetService);
  private readonly firestore = inject(Firestore);
  private readonly snackBar = inject(MatSnackBar);

  readonly model = signal<SiteSettings>({ ...this.settingsService.settings() });
  readonly saving = signal(false);
  readonly seeding = signal(false);

  readonly bouquetCount = this.bouquetService.active;

  updateField<K extends keyof SiteSettings>(key: K, value: string): void {
    this.model.update((m) => ({ ...m, [key]: value }));
  }

  async save(): Promise<void> {
    try {
      this.saving.set(true);
      await this.settingsService.save(this.model());
      this.snackBar.open('Налаштування збережено', 'Закрити', { duration: 2500, panelClass: ['posy-snackbar'] });
    } finally {
      this.saving.set(false);
    }
  }

  async seed(): Promise<void> {
    if (this.bouquetCount().length > 0) return;
    try {
      this.seeding.set(true);
      await seedDatabase(this.firestore);
      this.model.set({ ...DEFAULT_SETTINGS });
      this.snackBar.open('Початкові дані додано', 'Закрити', { duration: 2500, panelClass: ['posy-snackbar'] });
    } finally {
      this.seeding.set(false);
    }
  }
}
