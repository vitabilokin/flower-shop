import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  readonly scrolled = signal(false);

  readonly links = [
    { id: 'catalog', label: 'Каталог' },
    { id: 'quiz', label: 'Підбір букета' },
    { id: 'about', label: 'Про нас' },
    { id: 'contacts', label: 'Контакти' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
