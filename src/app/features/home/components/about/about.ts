import { Component } from '@angular/core';

interface AboutCard {
  photo: string;
  title: string;
  text: string;
}

const CARDS: AboutCard[] = [
  {
    photo: 'https://images.unsplash.com/photo-1658532190151-79610edf89fa?w=600',
    title: 'Збираємо щоранку',
    text: 'Квіти привозять на світанку — до вашої доставки вони ніколи не простоять і доби.',
  },
  {
    photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    title: 'Доставка за годину',
    text: 'Приймаємо замовлення до 20:00. Доставляємо по всьому місту — швидко і дбайливо.',
  },
  {
    photo: 'https://images.unsplash.com/photo-1528756514091-dee5ecaa3278?w=600',
    title: 'Ручна робота',
    text: 'Кожен букет збирає флорист вручну. Ніяких шаблонів — тільки живі квіти і турбота.',
  },
];

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  readonly cards = CARDS;
}
