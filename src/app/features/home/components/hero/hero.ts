import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../../core/services/settings.service';

@Component({
  standalone: true,
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class Hero {
  readonly flowers = [1, 2, 3, 4, 5, 6];
  readonly settingsService = inject(SettingsService);
}
