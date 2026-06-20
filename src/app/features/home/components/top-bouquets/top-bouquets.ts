import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BouquetService } from '../../../../core/services/bouquet.service';

@Component({
  selector: 'app-top-bouquets',
  imports: [RouterLink],
  templateUrl: './top-bouquets.html',
  styleUrl: './top-bouquets.scss',
})
export class TopBouquets {
  private readonly bouquetService = inject(BouquetService);

  readonly bouquets = this.bouquetService.getTop(4);
}
