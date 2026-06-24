import { Injectable, computed, inject, signal } from '@angular/core';
import { Bouquet, BouquetService } from './bouquet.service';

export interface QuizOption {
  id: string;
  label: string;
  icon: string;
  tags: string[];
  color?: string;
  maxPrice?: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  hint: string;
  gridCols: 2 | 3;
  options: QuizOption[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Для кого букет?',
    hint: 'Обери того, кому даруєш',
    gridCols: 3,
    options: [
      { id: 'lover', label: 'Коханій людині', icon: 'favorite', tags: ['romantic', 'anniversary'] },
      { id: 'mom', label: 'Мамі', icon: 'self_improvement', tags: ['gentle', 'birthday'] },
      { id: 'friend', label: 'Подрузі або другу', icon: 'group', tags: ['bright', 'fun'] },
      { id: 'self', label: 'Собі', icon: 'spa', tags: ['gentle', 'calm'] },
      { id: 'colleague', label: 'Колезі', icon: 'work', tags: ['neutral', 'calm'] },
      { id: 'child', label: 'Дитині', icon: 'child_care', tags: ['bright', 'fun'] },
    ],
  },
  {
    id: 2,
    question: 'Який привід?',
    hint: 'Що святкуємо або відзначаємо',
    gridCols: 3,
    options: [
      { id: 'birthday', label: 'День народження', icon: 'cake', tags: ['birthday', 'bright'] },
      { id: 'anniversary', label: 'Річниця', icon: 'favorite_border', tags: ['anniversary', 'romantic'] },
      { id: 'justbecause', label: 'Просто так', icon: 'wb_sunny', tags: ['justbecause', 'gentle'] },
      { id: 'sorry', label: 'Вибачення', icon: 'healing', tags: ['sorry', 'gentle'] },
      { id: 'thankyou', label: 'Подяка', icon: 'volunteer_activism', tags: ['thankyou', 'calm'] },
      { id: 'date', label: 'Перше побачення', icon: 'local_florist', tags: ['date', 'romantic'] },
    ],
  },
  {
    id: 3,
    question: 'Який у неї або нього характер?',
    hint: 'Обери що найближче',
    gridCols: 2,
    options: [
      { id: 'gentle', label: 'Ніжна і романтична', icon: 'filter_vintage', tags: ['gentle', 'romantic'], color: '#ff9cbf' },
      { id: 'bright', label: 'Яскрава і весела', icon: 'wb_sunny', tags: ['bright', 'fun'], color: '#ffd740' },
      { id: 'elegant', label: 'Спокійна і вишукана', icon: 'eco', tags: ['calm', 'elegant'], color: '#07b3a3' },
      { id: 'wild', label: 'Непередбачувана', icon: 'auto_awesome', tags: ['bright', 'fun'], color: '#ab47bc' },
    ],
  },
  {
    id: 4,
    question: 'Який настрій хочеш передати?',
    hint: 'Що має відчути людина коли отримає букет',
    gridCols: 2,
    options: [
      { id: 'love', label: 'Я тебе люблю', icon: 'favorite', tags: ['romantic', 'anniversary'], color: '#ff4d8d' },
      { id: 'sunshine', label: 'Ти моє сонце', icon: 'light_mode', tags: ['bright', 'fun'], color: '#ffd740' },
      { id: 'gratitude', label: 'Дякую що ти є', icon: 'volunteer_activism', tags: ['gentle', 'thankyou'], color: '#07b3a3' },
      { id: 'sorry', label: 'Вибач мене', icon: 'sentiment_very_satisfied', tags: ['sorry', 'gentle'], color: '#ce93d8' },
    ],
  },
  {
    id: 5,
    question: 'Який колір тобі відгукується?',
    hint: 'Довіряй інтуїції',
    gridCols: 2,
    options: [
      { id: 'pink', label: 'Рожевий і ніжний', icon: 'circle', tags: ['gentle', 'romantic'], color: '#ff9cbf' },
      { id: 'bright', label: 'Яскравий і різнобарвний', icon: 'palette', tags: ['bright', 'fun'], color: '#ffd740' },
      { id: 'white', label: 'Білий і чистий', icon: 'brightness_high', tags: ['calm', 'elegant'], color: '#f5f5f5' },
      { id: 'yellow', label: 'Жовтий і сонячний', icon: 'wb_sunny', tags: ['fun', 'bright'], color: '#ffce3f' },
    ],
  },
  {
    id: 6,
    question: 'Який бюджет?',
    hint: 'Гарний букет є в будь-якому бюджеті',
    gridCols: 2,
    options: [
      { id: 'budget', label: 'До 700 грн', icon: 'savings', tags: ['budget'], maxPrice: 700 },
      { id: 'mid', label: '700 — 1000 грн', icon: 'account_balance_wallet', tags: ['mid'], maxPrice: 1000 },
      { id: 'premium', label: '1000 — 1500 грн', icon: 'star', tags: ['premium'], maxPrice: 1500 },
      { id: 'luxury', label: 'Хочу найкраще', icon: 'workspace_premium', tags: ['luxury'], maxPrice: 9999 },
    ],
  },
  {
    id: 7,
    question: 'Коли потрібен букет?',
    hint: 'Щоб ми встигли підготувати все ідеально',
    gridCols: 3,
    options: [
      { id: 'today', label: 'Сьогодні — терміново', icon: 'bolt', tags: ['urgent'] },
      { id: 'tomorrow', label: 'Завтра', icon: 'today', tags: [] },
      { id: 'planned', label: 'Планую заздалегідь', icon: 'calendar_month', tags: [] },
    ],
  },
];

type Direction = 'next' | 'prev';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly bouquetService = inject(BouquetService);

  readonly questions = QUIZ_QUESTIONS;

  readonly currentStep = signal(0);
  readonly answers = signal<(QuizOption | null)[]>(new Array(QUIZ_QUESTIONS.length).fill(null));
  readonly showResult = signal(false);
  readonly direction = signal<Direction>('next');

  readonly currentQuestion = computed(() => this.questions[this.currentStep()]);
  readonly currentAnswer = computed(() => this.answers()[this.currentStep()]);
  readonly isFirstQuestion = computed(() => this.currentStep() === 0);
  readonly isLastQuestion = computed(() => this.currentStep() === this.questions.length - 1);

  readonly progress = computed(() => {
    if (this.showResult()) return 100;
    const answeredCount = this.answers().filter((a) => a !== null).length;
    return (answeredCount / this.questions.length) * 100;
  });

  selectOption(option: QuizOption): void {
    this.direction.set('next');
    this.answers.update((arr) => {
      const next = [...arr];
      next[this.currentStep()] = option;
      return next;
    });

    setTimeout(() => {
      if (this.isLastQuestion()) {
        this.showResult.set(true);
      } else {
        this.currentStep.update((s) => s + 1);
      }
    }, 400);
  }

  goBack(): void {
    this.direction.set('prev');
    if (this.showResult()) {
      this.showResult.set(false);
      return;
    }
    if (this.currentStep() > 0) {
      this.currentStep.update((s) => s - 1);
    }
  }

  restart(): void {
    this.currentStep.set(0);
    this.answers.set(new Array(this.questions.length).fill(null));
    this.showResult.set(false);
    this.direction.set('next');
  }

  getResult(): Bouquet[] {
    const answers = this.answers().filter((a): a is QuizOption => a !== null);
    const tags = answers.flatMap((a) => a.tags);
    const maxPrice = answers.find((a) => a.maxPrice !== undefined)?.maxPrice ?? 9999;

    const tagCounts: Record<string, number> = {};
    tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    const scored = this.bouquetService
      .getAll()
      .filter((b) => b.price <= maxPrice)
      .map((b) => ({
        bouquet: b,
        score: b.tags.reduce((sum, tag) => sum + (tagCounts[tag] || 0), 0),
      }))
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 3).map((s) => s.bouquet);
  }
}
