import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Firestore, addDoc, collection, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { collectionDataPlain } from './firestore-helpers';

export type Occasion =
  | 'birthday'
  | 'anniversary'
  | 'justbecause'
  | 'sorry'
  | 'thankyou'
  | 'date'
  | 'wedding'
  | 'graduation'
  | 'baby'
  | 'support';

export type BouquetType =
  | 'roses'
  | 'tulips'
  | 'sunflowers'
  | 'peonies'
  | 'lavender'
  | 'chrysanthemums'
  | 'orchids'
  | 'wildflowers'
  | 'gerberas'
  | 'lilies'
  | 'irises'
  | 'hydrangeas'
  | 'carnations'
  | 'ranunculus'
  | 'eustoma'
  | 'eucalyptus'
  | 'mixed';

export type BouquetColor =
  | 'pink'
  | 'red'
  | 'yellow'
  | 'white'
  | 'purple'
  | 'green'
  | 'orange'
  | 'teal'
  | 'blue'
  | 'burgundy'
  | 'lilac'
  | 'coral'
  | 'mixed';

/** active = shown and orderable; out_of_stock = shown with a badge but can't be ordered; hidden = not shown at all. */
export type BouquetStatus = 'active' | 'out_of_stock' | 'hidden';

export interface CompositionItem {
  type: BouquetType;
  count: number;
}

export interface Bouquet {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  photo: string;
  occasion: Occasion;
  type: BouquetType;
  color: BouquetColor;
  tag?: string;
  tagTone?: 'pink' | 'teal' | 'spark';
  /** Used by the mood quiz to score how well a bouquet matches the answers. */
  tags: string[];
  status: BouquetStatus;
  /** Soft-deleted bouquets are kept around (in an admin "archive") so they can be restored. */
  deleted: boolean;
  /** What's actually in the bouquet, e.g. "Троянди" x11, "Гіпсофіла" x5. */
  composition: CompositionItem[];
  createdAt?: unknown;
}

export interface OccasionCard {
  id: number;
  name: string;
  img: string;
  filter: Occasion;
}

export interface FilterOption {
  value: string;
  label: string;
}

const OCCASION_CARDS: OccasionCard[] = [
  { id: 1, name: 'День народження', img: 'https://plus.unsplash.com/premium_photo-1676475964992-6404b8db0b53?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', filter: 'birthday' },
  { id: 2, name: 'Річниця', img: 'https://images.unsplash.com/photo-1700142611715-8a023c5eb8c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJvdXF1ZXQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D', filter: 'anniversary' },
  { id: 3, name: 'Просто так', img: 'https://plus.unsplash.com/premium_photo-1674986175088-2d7dda41f7f8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEyfHx8ZW58MHx8fHx8', filter: 'justbecause' },
  { id: 4, name: 'Вибачення', img: 'https://images.unsplash.com/photo-1759419312960-cccfb9e85111?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIzfHx8ZW58MHx8fHx8', filter: 'sorry' },
  { id: 5, name: 'Подяка', img: 'https://images.unsplash.com/photo-1557925923-6885735abfb1?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', filter: 'thankyou' },
  { id: 6, name: 'Перше побачення', img: 'https://images.unsplash.com/photo-1518709779341-56cf4535e94b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym91cXVldCUyMG9mJTIwcm9zZXN8ZW58MHx8MHx8fDA%3D', filter: 'date' },
  { id: 7, name: 'Весілля', img: 'https://plus.unsplash.com/premium_photo-1671672208968-a7b3d754acd1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', filter: 'wedding' },
  { id: 8, name: 'Випускний', img: 'https://images.unsplash.com/photo-1777049742963-6865552e7244?q=80&w=868&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', filter: 'graduation' },
  { id: 9, name: 'Народження дитини', img: 'https://images.unsplash.com/photo-1748085901425-5121287df965?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', filter: 'baby' },
  { id: 10, name: 'Підтримка', img: 'https://images.unsplash.com/photo-1656056971530-641871b3bce3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHx8', filter: 'support' },
];

const OCCASION_OPTIONS: FilterOption[] = OCCASION_CARDS.map((c) => ({ value: c.filter, label: c.name }));

const TYPE_OPTIONS: FilterOption[] = [
  { value: 'roses', label: 'Троянди' },
  { value: 'tulips', label: 'Тюльпани' },
  { value: 'sunflowers', label: 'Соняхи' },
  { value: 'peonies', label: 'Півонії' },
  { value: 'lavender', label: 'Лаванда' },
  { value: 'chrysanthemums', label: 'Хризантеми' },
  { value: 'orchids', label: 'Орхідеї' },
  { value: 'wildflowers', label: 'Польові' },
  { value: 'gerberas', label: 'Гербери' },
  { value: 'lilies', label: 'Лілії' },
  { value: 'irises', label: 'Іриси' },
  { value: 'hydrangeas', label: 'Гортензії' },
  { value: 'carnations', label: 'Гвоздики' },
  { value: 'ranunculus', label: 'Ранункулюси' },
  { value: 'eustoma', label: 'Еустома' },
  { value: 'eucalyptus', label: 'Евкаліпт (зелень)' },
  { value: 'mixed', label: 'Змішані' },
];

export interface ColorOption extends FilterOption {
  swatch: string;
  border?: boolean;
  gradient?: boolean;
}

const COLOR_OPTIONS: ColorOption[] = [
  { value: 'pink', label: 'Рожевий', swatch: '#ff7eb0' },
  { value: 'red', label: 'Червоний', swatch: '#e53935' },
  { value: 'yellow', label: 'Жовтий', swatch: '#ffd84d' },
  { value: 'white', label: 'Білий', swatch: '#f5f5f5', border: true },
  { value: 'purple', label: 'Фіолетовий', swatch: '#7b2ff7' },
  { value: 'green', label: 'Зелений', swatch: '#6fce8f' },
  { value: 'orange', label: 'Помаранчевий', swatch: '#ff8a1e' },
  { value: 'teal', label: 'Бірюзовий', swatch: '#07b3a3' },
  { value: 'blue', label: 'Синій', swatch: '#4a7fe0' },
  { value: 'burgundy', label: 'Бордовий', swatch: '#6e1423' },
  { value: 'lilac', label: 'Ліловий', swatch: '#c9a6e8' },
  { value: 'coral', label: 'Кораловий', swatch: '#ff7f6b' },
  { value: 'mixed', label: 'Змішаний', swatch: 'linear-gradient(135deg, #ff7eb0, #7b2ff7, #ffd84d)', gradient: true },
];

export const STATUS_OPTIONS: { value: BouquetStatus; label: string }[] = [
  { value: 'active', label: 'Активний' },
  { value: 'out_of_stock', label: 'Немає в наявності' },
  { value: 'hidden', label: 'Прихований' },
];

const COLLECTION = 'bouquets';

@Injectable({ providedIn: 'root' })
export class BouquetService {
  private readonly firestore = inject(Firestore);

  private readonly allDocs = computed(() =>
    this.rawDocs().map((b) => ({
      ...b,
      status: b.status ?? ((b as unknown as { active?: boolean }).active === false ? 'hidden' : 'active'),
      deleted: b.deleted ?? false,
      composition: b.composition ?? [],
      tags: b.tags ?? [],
    })),
  );

  private readonly rawDocs = toSignal(collectionDataPlain<Bouquet>(collection(this.firestore, COLLECTION)), {
    initialValue: [] as Bouquet[],
  });

  readonly active = computed(() => this.allDocs().filter((b) => !b.deleted));

  readonly archived = computed(() => this.allDocs().filter((b) => b.deleted));

  readonly publicBouquets = computed(() => this.active().filter((b) => b.status !== 'hidden'));

  getAll(): Bouquet[] {
    return this.publicBouquets();
  }

  getById(id: string): Bouquet | undefined {
    return this.publicBouquets().find((b) => b.id === id);
  }

  getTop(n: number = 4): Bouquet[] {
    return this.getAll()
      .filter((b) => b.tag === 'Хіт' || b.tag === 'Новинка')
      .slice(0, n);
  }

  getOccasionCards(): OccasionCard[] {
    return OCCASION_CARDS;
  }

  getOccasionOptions(): FilterOption[] {
    return OCCASION_OPTIONS;
  }

  getTypeOptions(): FilterOption[] {
    return TYPE_OPTIONS;
  }

  getColorOptions(): ColorOption[] {
    return COLOR_OPTIONS;
  }

  getStatusOptions() {
    return STATUS_OPTIONS;
  }

  async addBouquet(data: Omit<Bouquet, 'id'>): Promise<void> {
    await addDoc(collection(this.firestore, COLLECTION), { ...data, createdAt: new Date() });
  }

  async updateBouquet(id: string, data: Partial<Bouquet>): Promise<void> {
    await updateDoc(doc(this.firestore, COLLECTION, id), data);
  }

  /** Soft delete — moves the bouquet into the admin archive instead of erasing it. */
  async archiveBouquet(id: string): Promise<void> {
    await updateDoc(doc(this.firestore, COLLECTION, id), { deleted: true });
  }

  async restoreBouquet(id: string): Promise<void> {
    await updateDoc(doc(this.firestore, COLLECTION, id), { deleted: false });
  }

  /** Permanently erases a bouquet — only meant to be called from the archive view. */
  async deleteForever(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, COLLECTION, id));
  }
}
