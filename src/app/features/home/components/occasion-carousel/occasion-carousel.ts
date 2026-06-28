import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BouquetService, OccasionCard } from '../../../../core/services/bouquet.service';

const END_EPSILON = 4;

@Component({
  selector: 'app-occasion-carousel',
  imports: [],
  templateUrl: './occasion-carousel.html',
  styleUrl: './occasion-carousel.scss',
})
export class OccasionCarousel {
  private readonly bouquetService = inject(BouquetService);
  private readonly router = inject(Router);

  @ViewChild('track') trackRef!: ElementRef<HTMLDivElement>;

  readonly occasions = this.bouquetService.getOccasionCards();

  scroll(direction: -1 | 1): void {
    const track = this.trackRef.nativeElement;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const atEnd = track.scrollLeft >= maxScroll - END_EPSILON;
    const atStart = track.scrollLeft <= END_EPSILON;

    if (direction === 1 && atEnd) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    if (direction === -1 && atStart) {
      track.scrollTo({ left: maxScroll, behavior: 'smooth' });
      return;
    }

    const amount = track.clientWidth * 0.8 * direction;
    track.scrollBy({ left: amount, behavior: 'smooth' });
  }

  open(card: OccasionCard): void {
    this.router.navigate(['/catalog'], { queryParams: { occasion: card.filter } });
  }
}
