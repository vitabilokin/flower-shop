import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlowerPricesService } from '../../../core/services/flower-prices.service';
import { FLOWERS } from '../../../core/services/constructor.service';

@Component({
  standalone: true,
  selector: 'app-flower-prices',
  imports: [FormsModule],
  templateUrl: './flower-prices.component.html',
  styleUrl: './flower-prices.component.scss',
})
export class FlowerPricesComponent {
  private readonly pricesService = inject(FlowerPricesService);

  readonly saving = signal(false);
  readonly saved = signal(false);
  readonly error = signal('');

  readonly prices = computed(() => {
    const overrides = this.pricesService.overrides();
    return FLOWERS.map((f) => ({
      id: f.id,
      name: f.name,
      img: f.img,
      defaultPrice: f.price,
      price: overrides[f.id] ?? f.price,
    }));
  });

  readonly draft = signal<Record<string, number>>({});

  ngOnInit(): void {
    this.resetDraft();
  }

  resetDraft(): void {
    const overrides = this.pricesService.overrides();
    const d: Record<string, number> = {};
    FLOWERS.forEach((f) => {
      d[f.id] = overrides[f.id] ?? f.price;
    });
    this.draft.set(d);
  }

  getPrice(id: string): number {
    return this.draft()[id];
  }

  setPrice(id: string, value: number): void {
    this.draft.update((d) => ({ ...d, [id]: value }));
  }

  async save(): Promise<void> {
    this.saving.set(true);
    this.error.set('');
    try {
      await this.pricesService.save(this.draft());
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 2500);
    } catch {
      this.error.set('Помилка збереження. Спробуйте ще раз.');
    } finally {
      this.saving.set(false);
    }
  }

  reset(id: string): void {
    const def = FLOWERS.find((f) => f.id === id)?.price ?? 0;
    this.draft.update((d) => ({ ...d, [id]: def }));
  }
}
