import { Component, effect, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { WrappingMaterialsService, MaterialOverride } from '../../../core/services/wrapping-materials.service';
import { WRAPPING } from '../../../core/services/constructor.service';

@Component({
  standalone: true,
  selector: 'app-materials',
  imports: [MatIconModule],
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.scss',
})
export class MaterialsComponent {
  private readonly materialsService = inject(WrappingMaterialsService);

  readonly saving = signal(false);
  readonly saved = signal(false);
  readonly error = signal('');
  readonly draft = signal<Record<string, MaterialOverride>>({});

  readonly wrappingItems = WRAPPING;

  private initialized = false;

  constructor() {
    effect(
      () => {
        this.materialsService.overrides();
        if (!this.initialized) {
          this.initialized = true;
          this.resetDraft();
        }
      },
      { allowSignalWrites: true },
    );
  }

  resetDraft(): void {
    const overrides = this.materialsService.overrides();
    const d: Record<string, MaterialOverride> = {};
    WRAPPING.forEach((w) => {
      d[w.id] = {
        price: overrides[w.id]?.price ?? w.price,
        available: overrides[w.id]?.available ?? true,
      };
    });
    this.draft.set(d);
  }

  getPrice(id: string): number {
    return this.draft()[id]?.price ?? 0;
  }

  setPrice(id: string, value: number): void {
    if (value < 0) return;
    this.draft.update((d) => ({ ...d, [id]: { ...d[id], price: value } }));
  }

  onPriceChange(id: string, event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(val) && val >= 0) this.setPrice(id, val);
  }

  isAvailable(id: string): boolean {
    return this.draft()[id]?.available ?? true;
  }

  toggleAvailable(id: string): void {
    this.draft.update((d) => ({ ...d, [id]: { ...d[id], available: !d[id]?.available } }));
  }

  reset(id: string): void {
    const def = WRAPPING.find((w) => w.id === id);
    if (def) {
      this.draft.update((d) => ({ ...d, [id]: { price: def.price, available: true } }));
    }
  }

  async save(): Promise<void> {
    this.saving.set(true);
    this.error.set('');
    try {
      await this.materialsService.save(this.draft());
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 2500);
    } catch {
      this.error.set('Помилка збереження. Спробуйте ще раз.');
    } finally {
      this.saving.set(false);
    }
  }
}
