import { Injectable } from '@angular/core';

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
  | 'mixed';

export interface Bouquet {
  id: number;
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

const BOUQUETS: Bouquet[] = [
  {
    id: 1,
    name: 'Для найкращої мами',
    subtitle: 'На день народження, 8 березня або просто так — бо мама завжди заслуговує на квіти.',
    price: 850,
    photo: 'https://images.unsplash.com/photo-1623406795110-99f1c4325084?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Ym91cXVldCUyMGZvciUyMG1vbXxlbnwwfHwwfHx8MA%3D%3D',
    occasion: 'birthday',
    type: 'roses',
    color: 'pink',
    tag: 'Хіт',
    tagTone: 'pink',
    tags: ['birthday', 'gentle', 'mid'],
  },
  {
    id: 2,
    name: 'В любові по вуха',
    subtitle: 'Коли слова застрягають у горлі, а серце готове вибухнути. Для того хто зробив тебе щасливим.',
    price: 1200,
    photo: 'https://images.unsplash.com/photo-1620142828449-203a4979d9c3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Ym91cXVldCUyMG9mJTIwcmVkJTIwZmxvd2Vyc3xlbnwwfHwwfHx8MA%3D%3D',
    occasion: 'anniversary',
    type: 'roses',
    color: 'red',
    tags: ['anniversary', 'romantic', 'premium'],
  },
  {
    id: 3,
    name: 'Без приводу, просто так',
    subtitle: 'Найкращий подарунок — той якого не чекають. Для людини яку хочеться порадувати без жодної причини.',
    price: 950,
    photo: 'https://plus.unsplash.com/premium_photo-1661659745326-d2535dfd268c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEyfHx8ZW58MHx8fHx8',
    occasion: 'justbecause',
    type: 'mixed',
    color: 'teal',
    tag: 'Сезонне',
    tagTone: 'teal',
    tags: ['justbecause', 'calm', 'mid'],
  },
  {
    id: 4,
    name: "Коли настрій кращий за погоду",
    subtitle: "Для святкування маленьких перемог, гарних новин або просто вдалого дня що хочеться запам'ятати.",
    price: 780,
    photo: 'https://images.unsplash.com/photo-1679502460180-f9f0c75267c2?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    occasion: 'birthday',
    type: 'mixed',
    color: 'yellow',
    tags: ['birthday', 'bright', 'fun', 'mid'],
  },
  {
    id: 5,
    name: 'Коли серце завмирає',
    subtitle: 'На річницю, весілля або коли хочеш нагадати коханій людині що почуття нікуди не зникли.',
    price: 1450,
    photo: 'https://images.unsplash.com/photo-1678043639749-fb3c5c0314ce?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM3fHx8ZW58MHx8fHx8',
    occasion: 'anniversary',
    type: 'mixed',
    color: 'pink',
    tags: ['anniversary', 'romantic', 'premium'],
  },
  {
    id: 6,
    name: 'Без причини — це і є причина',
    subtitle: 'Бо іноді найважливіше — просто показати що думаєш про людину. Без свят і приводів.',
    price: 690,
    photo: 'https://images.unsplash.com/photo-1584798962082-790d3f40fa04?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDcxfHx8ZW58MHx8fHx8',
    occasion: 'justbecause',
    type: 'mixed',
    color: 'green',
    tags: ['justbecause', 'calm', 'budget'],
  },
  {
    id: 7,
    name: 'Для тих хто мріє',
    subtitle: 'Для людини яка завжди дивиться трохи далі горизонту. На підтримку, натхнення або великий крок вперед.',
    price: 1100,
    photo: 'https://plus.unsplash.com/premium_photo-1678115816034-8bce8ae163af?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDgwfHx8ZW58MHx8fHx8',
    occasion: 'support',
    type: 'mixed',
    color: 'purple',
    tags: ['elegant', 'premium'],
  },
  {
    id: 8,
    name: 'Хочу справити враження',
    subtitle: 'Для першого побачення, важливої зустрічі або моменту коли хочеться щоб тебе запам\'ятали.',
    price: 990,
    photo: 'https://plus.unsplash.com/premium_photo-1668073436953-492767f88b8d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Ym91cXVldCUyMG9mJTIwYmx1ZSUyMGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
    occasion: 'date',
    type: 'roses',
    color: 'pink',
    tag: 'Новинка',
    tagTone: 'spark',
    tags: ['date', 'romantic', 'mid'],
  },
  {
    id: 9,
    name: 'Спасибі, що ти поруч',
    subtitle: 'Для людини яка була поруч коли було важко. Бо «дякую» іноді треба говорити квітами.',
    price: 720,
    photo: 'https://images.unsplash.com/photo-1678043639841-0dd13f8b1f1b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDg2fHx8ZW58MHx8fHx8',
    occasion: 'thankyou',
    type: 'mixed',
    color: 'yellow',
    tags: ['thankyou', 'gentle', 'mid'],
  },
  {
    id: 10,
    name: 'Слова скінчились — залишились квіти',
    subtitle: 'Коли посварились і не знаєш з чого почати. Квіти скажуть те що важко вимовити вголос.',
    price: 880,
    photo: 'https://images.unsplash.com/photo-1554742896-b3b354bd59f0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM1fHx8ZW58MHx8fHx8',
    occasion: 'sorry',
    type: 'roses',
    color: 'pink',
    tags: ['sorry', 'gentle', 'mid'],
  },
  {
    id: 11,
    name: 'Троянди класичні',
    subtitle: 'Вічна класика для тих хто цінує традиції.',
    price: 1100,
    photo: 'https://plus.unsplash.com/premium_photo-1677005659579-dfdefd6e6c09?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    occasion: 'anniversary',
    type: 'roses',
    color: 'red',
    tags: ['anniversary', 'romantic', 'premium'],
  },
  {
    id: 12,
    name: 'Тюльпани весняні',
    subtitle: 'Свіжість весни у кожній пелюстці.',
    price: 650,
    photo: 'https://images.unsplash.com/photo-1589994160839-163cd867cfe8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJvdXF1ZXQlMjBvZiUyMHR1bGlwc3xlbnwwfHwwfHx8MA%3D%3D',
    occasion: 'birthday',
    type: 'tulips',
    color: 'pink',
    tags: ['birthday', 'gentle', 'budget'],
  },
  {
    id: 13,
    name: 'Соняхи яскраві',
    subtitle: 'Тепло і радість — як сонце в букеті.',
    price: 720,
    photo: 'https://plus.unsplash.com/premium_photo-1676692121474-a3e3890d39f4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    occasion: 'justbecause',
    type: 'sunflowers',
    color: 'yellow',
    tags: ['justbecause', 'bright', 'fun', 'mid'],
  },
  {
    id: 14,
    name: 'Півонії ніжні',
    subtitle: "М'якість і розкіш для особливого моменту.",
    price: 1350,
    photo: 'https://images.unsplash.com/photo-1560583035-657b74826ec9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D',
    occasion: 'wedding',
    type: 'peonies',
    color: 'pink',
    tags: ['anniversary', 'romantic', 'elegant', 'premium'],
  },
  {
    id: 15,
    name: 'Лаванда прованс',
    subtitle: 'Спокій і аромат французького Провансу.',
    price: 890,
    photo: 'https://images.unsplash.com/photo-1635692027511-bea646416e86?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJvdXF1ZXQlMjBvZiUyMGxhdmFuZGVyfGVufDB8fDB8fHww',
    occasion: 'thankyou',
    type: 'lavender',
    color: 'purple',
    tags: ['thankyou', 'calm', 'elegant', 'mid'],
  },
  {
    id: 16,
    name: 'Хризантеми білі',
    subtitle: 'Чистота і елегантність у кожній квітці.',
    price: 780,
    photo: 'https://images.unsplash.com/photo-1767797285478-ad1c6241c839?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    occasion: 'support',
    type: 'chrysanthemums',
    color: 'white',
    tags: ['calm', 'elegant', 'mid'],
  },
  {
    id: 17,
    name: 'Орхідеї преміум',
    subtitle: 'Вишуканість для тих хто цінує красу.',
    price: 1800,
    photo: 'https://images.unsplash.com/photo-1729603369767-3d151219fe75?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI3fHx8ZW58MHx8fHx8',
    occasion: 'anniversary',
    type: 'orchids',
    color: 'white',
    tag: 'Преміум',
    tagTone: 'pink',
    tags: ['anniversary', 'elegant', 'luxury'],
  },
  {
    id: 18,
    name: 'Польові квіти',
    subtitle: 'Натуральна краса лугів і полів.',
    price: 590,
    photo: 'https://images.unsplash.com/photo-1596238276574-b3e8d40fbafb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym91cXVldCUyMG9mJTIwd2lsZGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
    occasion: 'justbecause',
    type: 'wildflowers',
    color: 'mixed',
    tags: ['justbecause', 'bright', 'fun', 'budget'],
  },
  {
    id: 19,
    name: 'Гербери сонячні',
    subtitle: 'Яскравість і позитив на весь день.',
    price: 680,
    photo: 'https://plus.unsplash.com/premium_photo-1692394464308-5f876cfbae69?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ym91cXVldCUyMG9mJTIwYnJpZ2h0JTIwZmxvd2Vyc3xlbnwwfHwwfHx8MA%3D%3D',
    occasion: 'birthday',
    type: 'gerberas',
    color: 'orange',
    tags: ['birthday', 'bright', 'fun', 'budget'],
  },
  {
    id: 20,
    name: 'Лілії білі',
    subtitle: 'Ніжний аромат і чиста елегантність.',
    price: 950,
    photo: 'https://images.unsplash.com/photo-1772211505818-c15eecf8e3c9?q=80&w=790&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    occasion: 'wedding',
    type: 'lilies',
    color: 'white',
    tags: ['elegant', 'calm', 'mid'],
  },
];

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
  { value: 'mixed', label: 'Змішаний', swatch: 'linear-gradient(135deg, #ff7eb0, #7b2ff7, #ffd84d)', gradient: true },
];

@Injectable({ providedIn: 'root' })
export class BouquetService {
  private readonly bouquets = BOUQUETS;

  getAll(): Bouquet[] {
    return this.bouquets;
  }

  getById(id: number): Bouquet | undefined {
    return this.bouquets.find((b) => b.id === id);
  }

  getTop(n: number = 4): Bouquet[] {
    return this.bouquets.filter((b) => b.tag === 'Хіт' || b.tag === 'Новинка').slice(0, n);
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
}
