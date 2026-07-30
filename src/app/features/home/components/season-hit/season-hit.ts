import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BouquetService } from '../../../../core/services/bouquet.service';

@Component({
  standalone: true,
  selector: 'app-season-hit',
  imports: [RouterLink],
  templateUrl: './season-hit.component.html',
  styleUrl: './season-hit.component.scss',
})
export class SeasonHit {
  private readonly bouquetService = inject(BouquetService);

  readonly bouquet = computed(() => this.bouquetService.getAll().find((b) => b.tag === 'Сезонне'));

  readonly photo = 'https://images.unsplash.com/photo-1646857705758-749ba174b898?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEzfHx8ZW58MHx8fHx8';
}
