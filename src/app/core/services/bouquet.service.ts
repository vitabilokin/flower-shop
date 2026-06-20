import { Injectable } from '@angular/core';

export interface Bouquet {
  id: number;
  name: string;
  subtitle: string;
  price: number;
  photo: string;
  tag?: string;
  tagTone?: 'pink' | 'teal' | 'spark';
}

const BOUQUETS: Bouquet[] = [
  {
    id: 1,
    name: 'Для найкращої мами',
    subtitle: 'На день народження, 8 березня або просто так — бо мама завжди заслуговує на квіти.',
    price: 850,
    photo: 'https://images.unsplash.com/photo-1658532190151-79610edf89fa?w=600',
    tag: 'Хіт',
    tagTone: 'pink',
  },
  {
    id: 2,
    name: 'В любові по вуха',
    subtitle: 'Коли слова застрягають у горлі, а серце готове вибухнути. Для того хто зробив тебе щасливим.',
    price: 1200,
    photo: 'https://images.unsplash.com/photo-1548586196-aa5803b77379?w=600',
  },
  {
    id: 3,
    name: 'Без приводу, просто так',
    subtitle: 'Найкращий подарунок — той якого не чекають. Для людини яку хочеться порадувати без жодної причини.',
    price: 950,
    photo: 'https://images.unsplash.com/photo-1602408986531-4d725fcdd96a?w=600',
    tag: 'Сезонне',
    tagTone: 'teal',
  },
  {
    id: 4,
    name: "Коли настрій кращий за погоду",
    subtitle: "Для святкування маленьких перемог, гарних новин або просто вдалого дня що хочеться запам'ятати.",
    price: 780,
    photo: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600',
  },
  {
    id: 5,
    name: 'Коли серце завмирає',
    subtitle: 'На річницю, весілля або коли хочеш нагадати коханій людині що почуття нікуди не зникли.',
    price: 1450,
    photo: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600',
  },
  {
    id: 6,
    name: 'Без причини — це і є причина',
    subtitle: 'Бо іноді найважливіше — просто показати що думаєш про людину. Без свят і приводів.',
    price: 690,
    photo: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=600',
  },
  {
    id: 7,
    name: 'Для тих хто мріє',
    subtitle: 'Для людини яка завжди дивиться трохи далі горизонту. На підтримку, натхнення або великий крок вперед.',
    price: 1100,
    photo: 'https://images.unsplash.com/photo-1528756514091-dee5ecaa3278?w=600',
  },
  {
    id: 8,
    name: 'Хочу справити враження',
    subtitle: 'Для першого побачення, важливої зустрічі або моменту коли хочеться щоб тебе запам\'ятали.',
    price: 990,
    photo: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600',
    tag: 'Новинка',
    tagTone: 'spark',
  },
  {
    id: 9,
    name: 'Спасибі, що ти поруч',
    subtitle: 'Для людини яка була поруч коли було важко. Бо «дякую» іноді треба говорити квітами.',
    price: 720,
    photo: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=600',
  },
  {
    id: 10,
    name: 'Слова скінчились — залишились квіти',
    subtitle: 'Коли посварились і не знаєш з чого почати. Квіти скажуть те що важко вимовити вголос.',
    price: 880,
    photo: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600',
  },
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
}
