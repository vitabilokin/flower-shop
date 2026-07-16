import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { QuizOption, QuizService } from '../../core/services/quiz.service';
import { Bouquet } from '../../core/services/bouquet.service';
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

  readonly addedIds = signal<ReadonlySet<string>>(new Set());

  readonly result = computed<Bouquet[]>(() => (this.quizService.showResult() ? this.quizService.getResult() : []));

  isSelected(option: QuizOption): boolean {
    return this.quizService.currentAnswer()?.id === option.id;
  }

  select(option: QuizOption): void {
    this.quizService.selectOption(option);
  }

  goBack(): void {
    this.quizService.goBack();
  }

  restart(): void {
    this.quizService.restart();
  }

  addToCart(b: Bouquet): void {
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
