import { Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { OccasionCarousel } from './components/occasion-carousel/occasion-carousel';
import { SeasonHit } from './components/season-hit/season-hit';
import { TopBouquets } from './components/top-bouquets/top-bouquets';
import { About } from './components/about/about';
import { Contacts } from './components/contacts/contacts';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [Hero, OccasionCarousel, SeasonHit, TopBouquets, About, Contacts],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
