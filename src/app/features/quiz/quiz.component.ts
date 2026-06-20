import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BouquetHighlight } from '../../core/services/bouquet-highlight';

interface Question {
  question: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  { question: 'Для кого букет?', options: ['Коханій людині', 'Мамі', 'Подрузі / другу', 'Собі'] },
  { question: 'Який привід?', options: ['День народження', 'Просто так', 'Вибачення', 'Велике свято'] },
  { question: 'Який настрій?', options: ['Ніжний', 'Яскравий', 'Стриманий', 'Романтичний'] },
];

const MOOD_TO_BOUQUET: Record<string, number> = {
  'Ніжний': 1,
  'Яскравий': 4,
  'Стриманий': 3,
  'Романтичний': 5,
};

@Component({
  selector: 'app-quiz',
  imports: [],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
})
export class QuizComponent {
  private readonly highlight = inject(BouquetHighlight);
  private readonly router = inject(Router);

  readonly questions = QUESTIONS;
  readonly step = signal(0);
  readonly answers = signal<string[]>([]);

  select(option: string): void {
    const current = this.step();

    if (current === this.questions.length - 1) {
      const bouquetId = MOOD_TO_BOUQUET[option] ?? 1;
      this.highlight.highlight(bouquetId);
      this.reset();
      this.router.navigate(['/catalog']);
      return;
    }

    this.answers.update((a) => [...a, option]);
    this.step.set(current + 1);
  }

  reset(): void {
    this.step.set(0);
    this.answers.set([]);
  }
}
