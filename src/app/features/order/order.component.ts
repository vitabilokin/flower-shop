import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

const TELEGRAM_USERNAME = 'TELEGRAM_USERNAME';
const PHONE_NUMBER = 'PHONE_NUMBER';

interface OrderMethod {
  iconType: 'img' | 'mat';
  icon: string;
  iconColor?: string;
  title: string;
  text: string;
  buttonLabel: string;
  href: string;
  accent: 'teal' | 'viber' | 'pink';
}

interface Step {
  icon: string;
  title: string;
  text: string;
}

interface DeliveryFact {
  icon: string;
  text: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const ORDER_METHODS: OrderMethod[] = [
  {
    iconType: 'img',
    icon: 'telegram',
    iconColor: '07b3a3',
    title: 'Написати в Telegram',
    text: 'Надішліть фото або назву букета — відповімо за кілька хвилин',
    buttonLabel: 'Написати',
    href: `https://t.me/${TELEGRAM_USERNAME}`,
    accent: 'teal',
  },
  {
    iconType: 'img',
    icon: 'viber',
    iconColor: '7360f2',
    title: 'Написати у Viber',
    text: 'Зручно для голосових повідомлень і фото букетів',
    buttonLabel: 'Написати',
    href: `viber://chat?number=${PHONE_NUMBER}`,
    accent: 'viber',
  },
  {
    iconType: 'mat',
    icon: 'phone',
    title: 'Подзвонити',
    text: 'Пн-Нд з 08:00 до 21:00. Приймаємо замовлення на будь-який час',
    buttonLabel: 'Зателефонувати',
    href: `tel:${PHONE_NUMBER}`,
    accent: 'pink',
  },
];

const STEPS: Step[] = [
  {
    icon: 'search',
    title: 'Обери букет',
    text: 'Перегляньте каталог або пройдіть квіз — ми підберемо ідеальний варіант',
  },
  {
    icon: 'chat',
    title: 'Напишіть нам',
    text: 'Надішліть назву або фото букета у зручний месенджер',
  },
  {
    icon: 'local_florist',
    title: 'Отримайте доставку',
    text: 'Зберемо свіжий букет і доставимо протягом години',
  },
];

const DELIVERY_FACTS: DeliveryFact[] = [
  { icon: 'bolt', text: 'Від 1 години' },
  { icon: 'payments', text: 'Безкоштовно від 1000 грн' },
  { icon: 'schedule', text: 'Щодня 08:00 – 21:00' },
  { icon: 'location_on', text: 'По всьому місту' },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Як швидко доставите букет?',
    answer: 'Стандартна доставка — від 2 годин. Термінова — від 1 години за додаткову плату.',
  },
  {
    question: 'Чи можна замовити на конкретний час?',
    answer: 'Так, просто вкажіть бажаний час при замовленні — ми підтвердимо.',
  },
  {
    question: 'Як оплатити замовлення?',
    answer: 'Готівкою при отриманні або карткою онлайн через посилання від менеджера.',
  },
  {
    question: 'Чи є доставка за місто?',
    answer: 'Так, але вартість і терміни обговорюються індивідуально.',
  },
  {
    question: 'Чи можна замовити букет заздалегідь?',
    answer: 'Звісно! Можна замовити за кілька днів і вказати точний час доставки.',
  },
];

@Component({
  standalone: true,
  selector: 'app-order',
  imports: [MatIconModule, MatExpansionModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent {
  readonly orderMethods = ORDER_METHODS;
  readonly steps = STEPS;
  readonly deliveryFacts = DELIVERY_FACTS;
  readonly faqItems = FAQ_ITEMS;
  readonly phoneHref = `tel:${PHONE_NUMBER}`;
  readonly phoneLabel = PHONE_NUMBER;
}
