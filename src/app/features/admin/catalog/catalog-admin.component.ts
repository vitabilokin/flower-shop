import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Bouquet, BouquetService, BouquetStatus } from '../../../core/services/bouquet.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { BouquetFormDialogComponent, BouquetFormResult } from './bouquet-form-dialog/bouquet-form-dialog.component';

type Tab = 'active' | 'archive';

@Component({
  standalone: true,
  selector: 'app-admin-catalog',
  imports: [FormsModule, MatDialogModule, MatIconModule, MatSnackBarModule],
  templateUrl: './catalog-admin.component.html',
  styleUrl: './catalog-admin.component.scss',
})
export class CatalogAdminComponent {
  private readonly bouquetService = inject(BouquetService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly confirmService = inject(ConfirmService);

  readonly tab = signal<Tab>('active');
  readonly bouquets = this.bouquetService.active;
  readonly archived = this.bouquetService.archived;
  readonly statusOptions = this.bouquetService.getStatusOptions();

  setTab(tab: Tab): void {
    this.tab.set(tab);
  }

  openAdd(): void {
    const ref = this.dialog.open<BouquetFormDialogComponent, Bouquet | null, BouquetFormResult>(
      BouquetFormDialogComponent,
      { data: null, width: '95vw', maxWidth: '560px', maxHeight: '85vh' },
    );
    ref.afterClosed().subscribe(async (result) => {
      if (!result) return;
      await this.bouquetService.addBouquet(result.data);
      this.snackBar.open('Букет додано', 'Закрити', { duration: 2500, panelClass: ['posy-snackbar'] });
    });
  }

  openEdit(bouquet: Bouquet): void {
    const ref = this.dialog.open<BouquetFormDialogComponent, Bouquet | null, BouquetFormResult>(
      BouquetFormDialogComponent,
      { data: bouquet, width: '95vw', maxWidth: '560px', maxHeight: '85vh' },
    );
    ref.afterClosed().subscribe(async (result) => {
      if (!result) return;
      await this.bouquetService.updateBouquet(bouquet.id, result.data);
      this.snackBar.open('Букет оновлено', 'Закрити', { duration: 2500, panelClass: ['posy-snackbar'] });
    });
  }

  async setStatus(bouquet: Bouquet, status: BouquetStatus): Promise<void> {
    await this.bouquetService.updateBouquet(bouquet.id, { status });
  }

  async archive(bouquet: Bouquet): Promise<void> {
    const ok = await this.confirmService.confirm({
      title: 'Перемістити в архів?',
      message: `Букет «${bouquet.name}» зникне з каталогу, але його можна відновити з архіву.`,
      confirmLabel: 'В архів',
    });
    if (!ok) return;
    await this.bouquetService.archiveBouquet(bouquet.id);
    this.snackBar.open('Букет перенесено в архів', 'Закрити', { duration: 2500, panelClass: ['posy-snackbar'] });
  }

  async restore(bouquet: Bouquet): Promise<void> {
    await this.bouquetService.restoreBouquet(bouquet.id);
    this.snackBar.open('Букет відновлено', 'Закрити', { duration: 2500, panelClass: ['posy-snackbar'] });
  }

  async deleteForever(bouquet: Bouquet): Promise<void> {
    const ok = await this.confirmService.confirm({
      title: 'Видалити назавжди?',
      message: `Букет «${bouquet.name}» буде видалено остаточно. Цю дію не можна скасувати.`,
      confirmLabel: 'Видалити',
      danger: true,
    });
    if (!ok) return;
    await this.bouquetService.deleteForever(bouquet.id);
    this.snackBar.open('Букет видалено назавжди', 'Закрити', { duration: 2500, panelClass: ['posy-snackbar'] });
  }
}
