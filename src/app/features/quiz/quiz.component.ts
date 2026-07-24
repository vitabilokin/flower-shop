import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { QuizOption, QuizResult, QuizService } from '../../core/services/quiz.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  standalone: true,
  selector: 'app-quiz',
  imports: [RouterLink, MatIconModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
})
export class QuizComponent {
  readonly quizService = inject(QuizService);
  private readonly cartService = inject(CartService);

  readonly addedIds       = signal<ReadonlySet<string>>(new Set());
  readonly justSelectedId = signal<string | null>(null);

  /** Free-text values for "Інше" options, keyed by question step index */
  readonly customInputs = signal<Record<number, string>>({});

  readonly result = computed<QuizResult[]>(
    () => (this.quizService.showResult() ? this.quizService.getResult() : []),
  );

  readonly resultTitle = computed(() => {
    if (!this.quizService.showResult()) return '';
    const results = this.result();
    if (!results.length) return 'Переглянь наш каталог';
    const strength = results[0].matchStrength;
    return strength === 'strong'
      ? 'Ідеальний вибір для тебе'
      : strength === 'medium'
        ? 'Ми підібрали для тебе'
        : 'Найближчі варіанти до твоїх побажань';
  });

  /** True when the "other" option is currently selected */
  readonly otherSelected = computed(
    () => this.quizService.currentAnswer()?.id === 'other',
  );

  /** Placeholder text for the "other" free-text input, per question */
  readonly otherPlaceholder = computed(() => {
    const q = this.quizService.currentQuestion();
    if (q.id === 1) return 'Наприклад: бабусі, тітці, вчительці...';
    if (q.id === 2) return 'Наприклад: промоція, іменини, просто сюрприз...';
    return 'Розкажи докладніше...';
  });

  readonly currentOtherText = computed(
    () => this.customInputs()[this.quizService.currentStep()] ?? '',
  );

  isSelected(option: QuizOption): boolean {
    return this.quizService.currentAnswer()?.id === option.id;
  }

  select(option: QuizOption): void {
    this.justSelectedId.set(option.id);

    if (option.id === 'other') {
      // Save "other" but don't auto-advance — let user type, then click "Далі"
      this.quizService.selectOnly(option);
      return;
    }

    this.quizService.selectOption(option);
    setTimeout(() => this.justSelectedId.set(null), 400);
  }

  proceedFromOther(): void {
    this.justSelectedId.set(null);
    this.quizService.advanceFromCurrent();
  }

  setOtherText(text: string): void {
    const step = this.quizService.currentStep();
    this.customInputs.update((inputs) => ({ ...inputs, [step]: text }));
  }

  goBack(): void {
    this.quizService.goBack();
  }

  goToQuestion(stepIndex: number): void {
    this.quizService.goToQuestion(stepIndex);
  }

  restart(): void {
    this.quizService.restart();
  }

  addToCart(b: QuizResult['bouquet']): void {
    this.cartService.add(b);
    this.addedIds.update((ids) => new Set(ids).add(b.id));
    setTimeout(() => {
      this.addedIds.update((ids) => {
        const next = new Set(ids);
        next.delete(b.id);
        return next;
      });
    }, 1500);
  }
}
