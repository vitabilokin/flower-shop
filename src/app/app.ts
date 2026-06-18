import { Component } from '@angular/core';
import { Nav } from './components/nav/nav';
import { Hero } from './components/hero/hero';
import { MoodQuiz } from './components/mood-quiz/mood-quiz';
import { Catalog } from './components/catalog/catalog';
import { About } from './components/about/about';
import { Contacts } from './components/contacts/contacts';
import { Footer } from './components/footer/footer';
import { ToastComponent } from './components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [Nav, Hero, MoodQuiz, Catalog, About, Contacts, Footer, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
