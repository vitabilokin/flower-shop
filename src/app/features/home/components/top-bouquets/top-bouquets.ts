import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BouquetService } from '../../../../core/services/bouquet.service';

@Component({
  standalone: true,
  selector: 'app-top-bouquets',
  imports: [RouterLink],
  templateUrl: './top-bouquets.component.html',
  styleUrl: './top-bouquets.component.scss',
})
export class TopBouquets {
  private readonly bouquetService = inject(BouquetService);

  readonly bouquets = computed(() => this.bouquetService.getTop(4));
}
