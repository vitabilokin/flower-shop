import { Component } from '@angular/core';

interface AboutCard {
  photo: string;
  title: string;
  text: string;
}

const CARDS: AboutCard[] = [
  {
    photo: 'https://images.unsplash.com/photo-1600418692921-18c91a64baa8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEZsb3dlciUyMGZpZWxkc3xlbnwwfHwwfHx8MA%3D%3D',
    title: 'Збираємо щоранку',
    text: 'Квіти привозять на світанку — до вашої доставки вони ніколи не простоять і доби.',
  },
  {
    photo: 'https://plus.unsplash.com/premium_photo-1682145275988-128f5628cf51?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Доставка за годину',
    text: 'Приймаємо замовлення до 20:00. Доставляємо по всьому місту — швидко і дбайливо.',
  },
  {
    photo: 'https://plus.unsplash.com/premium_photo-1726711352215-d4dd80f8c9bc?q=80&w=2054&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Ручна робота',
    text: 'Кожен букет збирає флорист вручну. Ніяких шаблонів — тільки живі квіти і турбота.',
  },
];

@Component({
  standalone: true,
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class About {
  readonly cards = CARDS;
}
