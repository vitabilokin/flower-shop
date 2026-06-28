import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../../core/services/settings.service';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  readonly flowers = [1, 2, 3, 4, 5, 6];
  readonly settingsService = inject(SettingsService);
}
