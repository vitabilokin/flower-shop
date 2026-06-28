import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BouquetService } from '../../../core/services/bouquet.service';
import { SeasonHits, SeasonService } from '../../../core/services/season.service';

const MONTH_NAMES = [
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень',
];

const MAX_PER_MONTH = 3;

@Component({
  selector: 'app-admin-season',
  imports: [MatCheckboxModule],
  templateUrl: './season.component.html',
  styleUrl: './season.component.scss',
})
export class SeasonComponent {
  private readonly seasonService = inject(SeasonService);
  private readonly bouquetService = inject(BouquetService);

  readonly months = MONTH_NAMES.map((name, i) => ({ number: i + 1, name }));
  readonly selectedMonth = signal(1);

  readonly seasonHits = toSignal(this.seasonService.getSeasonHits(), { initialValue: undefined as SeasonHits | undefined });
  // Only bouquets a customer could actually buy make sense as a "season hit".
  readonly bouquets = computed(() => this.bouquetService.active().filter((b) => b.status === 'active'));

  readonly savedFlash = signal(false);

  readonly selectedIds = computed<string[]>(() => this.seasonHits()?.[String(this.selectedMonth())] ?? []);

  countFor(month: number): number {
    return this.seasonHits()?.[String(month)]?.length ?? 0;
  }

  selectMonth(month: number): void {
    this.selectedMonth.set(month);
  }

  isChecked(bouquetId: string | undefined): boolean {
    return !!bouquetId && this.selectedIds().includes(bouquetId);
  }

  isMaxedOut(bouquetId: string | undefined): boolean {
    return !!bouquetId && !this.isChecked(bouquetId) && this.selectedIds().length >= MAX_PER_MONTH;
  }

  async toggle(bouquetId: string | undefined): Promise<void> {
    if (!bouquetId) return;
    const current = this.selectedIds();
    const next = current.includes(bouquetId)
      ? current.filter((id) => id !== bouquetId)
      : current.length < MAX_PER_MONTH
        ? [...current, bouquetId]
        : current;

    if (next === current) return;

    await this.seasonService.setMonthBouquets(this.selectedMonth(), next);
    this.savedFlash.set(true);
    setTimeout(() => this.savedFlash.set(false), 1500);
  }
}
