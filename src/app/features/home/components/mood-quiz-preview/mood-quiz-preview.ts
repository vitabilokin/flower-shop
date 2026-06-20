import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

const MOODS = ['Ніжний', 'Яскравий', 'Стриманий', 'Романтичний'];

@Component({
  selector: 'app-mood-quiz-preview',
  imports: [RouterLink],
  templateUrl: './mood-quiz-preview.html',
  styleUrl: './mood-quiz-preview.scss',
})
export class MoodQuizPreview {
  private readonly router = inject(Router);

  readonly moods = MOODS;

  goToQuiz(): void {
    this.router.navigate(['/quiz']);
  }
}
