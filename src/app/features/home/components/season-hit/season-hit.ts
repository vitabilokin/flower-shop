import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BouquetService } from '../../../../core/services/bouquet.service';

@Component({
  selector: 'app-season-hit',
  imports: [RouterLink],
  templateUrl: './season-hit.html',
  styleUrl: './season-hit.scss',
})
export class SeasonHit {
  private readonly bouquetService = inject(BouquetService);

  readonly bouquet = this.bouquetService.getAll().find((b) => b.tag === 'Сезонне');
}
