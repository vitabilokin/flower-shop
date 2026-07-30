import { Component, ElementRef, ViewChild, afterNextRender, inject } from '@angular/core';
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
  readonly settingsService = inject(SettingsService);

  @ViewChild('heroVideo') videoRef?: ElementRef<HTMLVideoElement>;

  constructor() {
    afterNextRender(() => {
      const video = this.videoRef?.nativeElement;
      if (!video) return;
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches) video.pause();
      mq.addEventListener('change', (e) => {
        if (e.matches) video.pause();
        else video.play().catch(() => {});
      });
    });
  }
}
