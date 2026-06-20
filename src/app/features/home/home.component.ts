import { Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { SeasonHit } from './components/season-hit/season-hit';
import { TopBouquets } from './components/top-bouquets/top-bouquets';
import { MoodQuizPreview } from './components/mood-quiz-preview/mood-quiz-preview';
import { About } from './components/about/about';
import { Contacts } from './components/contacts/contacts';

@Component({
  selector: 'app-home',
  imports: [Hero, SeasonHit, TopBouquets, MoodQuizPreview, About, Contacts],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
