import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FlowerType } from '../../../core/services/constructor.service';

@Component({
  // Attribute selector so this attaches to an existing native <g>/<svg> element instead of
  // creating its own host tag — browsers force display:none on unrecognized elements inside
  // <svg> (even with author !important), so a custom element tag can never render there.
  selector: '[appFlowerIcon]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (type()) {
      @case ('rose') {
        <svg:g>
          <svg:circle cx="0" cy="-12" r="9" [attr.fill]="petalColor()" opacity="0.9" />
          <svg:circle cx="11" cy="-4" r="9" [attr.fill]="petalColor()" opacity="0.9" />
          <svg:circle cx="7" cy="10" r="9" [attr.fill]="petalColor()" opacity="0.9" />
          <svg:circle cx="-7" cy="10" r="9" [attr.fill]="petalColor()" opacity="0.9" />
          <svg:circle cx="-11" cy="-4" r="9" [attr.fill]="petalColor()" opacity="0.9" />
          <svg:circle cx="0" cy="0" r="7" [attr.fill]="centerColor()" />
        </svg:g>
      }
      @case ('tulip') {
        <svg:g>
          <svg:ellipse cx="0" cy="-8" rx="10" ry="16" [attr.fill]="petalColor()" />
          <svg:path d="M-8,-4 Q-14,4 -6,10" [attr.fill]="petalColor()" opacity="0.8" />
          <svg:path d="M8,-4 Q14,4 6,10" [attr.fill]="petalColor()" opacity="0.8" />
        </svg:g>
      }
      @case ('sunflower') {
        <svg:g>
          @for (angle of twelveAngles; track angle) {
            <svg:ellipse cx="0" cy="-16" rx="5" ry="10" [attr.fill]="petalColor()" [attr.transform]="'rotate(' + angle + ')'" />
          }
          <svg:circle cx="0" cy="0" r="9" [attr.fill]="centerColor()" />
          <svg:circle cx="0" cy="0" r="5" fill="#795548" />
        </svg:g>
      }
      @case ('peony') {
        <svg:g>
          @for (angle of eightAngles; track angle) {
            <svg:ellipse cx="0" cy="-14" rx="6" ry="11" [attr.fill]="petalColor()" opacity="0.7" [attr.transform]="'rotate(' + angle + ')'" />
          }
          @for (angle of sixAngles; track angle) {
            <svg:ellipse cx="0" cy="-8" rx="5" ry="8" [attr.fill]="petalColor()" opacity="0.9" [attr.transform]="'rotate(' + angle + ')'" />
          }
          <svg:circle cx="0" cy="0" r="6" [attr.fill]="centerColor()" />
        </svg:g>
      }
      @case ('lily') {
        <svg:g>
          @for (angle of sixAngles; track angle) {
            <svg:ellipse cx="0" cy="-15" rx="6" ry="18" [attr.fill]="petalColor()" [attr.transform]="'rotate(' + angle + ')'" />
          }
          <svg:circle cx="0" cy="0" r="5" [attr.fill]="centerColor()" />
        </svg:g>
      }
      @case ('orchid') {
        <svg:g>
          <svg:ellipse cx="0" cy="-13" rx="7" ry="13" [attr.fill]="petalColor()" opacity="0.85" />
          <svg:ellipse cx="12" cy="-3" rx="7" ry="13" [attr.fill]="petalColor()" opacity="0.85" [attr.transform]="'rotate(60 12 -3)'" />
          <svg:ellipse cx="7" cy="11" rx="7" ry="13" [attr.fill]="petalColor()" opacity="0.85" [attr.transform]="'rotate(120 7 11)'" />
          <svg:ellipse cx="-7" cy="11" rx="7" ry="13" [attr.fill]="petalColor()" opacity="0.85" [attr.transform]="'rotate(-120 -7 11)'" />
          <svg:ellipse cx="-12" cy="-3" rx="7" ry="13" [attr.fill]="petalColor()" opacity="0.85" [attr.transform]="'rotate(-60 -12 -3)'" />
          <svg:ellipse cx="0" cy="4" rx="6" ry="8" [attr.fill]="centerColor()" />
        </svg:g>
      }
      @case ('gerbera') {
        <svg:g>
          @for (angle of sixteenAngles; track angle) {
            <svg:ellipse cx="0" cy="-15" rx="4" ry="12" [attr.fill]="petalColor()" [attr.transform]="'rotate(' + angle + ')'" />
          }
          <svg:circle cx="0" cy="0" r="7" [attr.fill]="centerColor()" />
          <svg:circle cx="0" cy="0" r="4" fill="#333" opacity="0.3" />
        </svg:g>
      }
    }
    @if (showStem()) {
      <svg:line x1="0" [attr.y1]="stemStartY()" x2="0" y2="45" stroke="#4caf50" stroke-width="2.5" />
    }
  `,
})
export class FlowerIcon {
  readonly type = input.required<FlowerType>();
  readonly petalColor = input<string>('#f06292');
  readonly centerColor = input<string>('#fce4ec');
  readonly showStem = input<boolean>(true);

  readonly twelveAngles = Array.from({ length: 12 }, (_, i) => i * 30);
  readonly sixteenAngles = Array.from({ length: 16 }, (_, i) => i * 22.5);
  readonly eightAngles = Array.from({ length: 8 }, (_, i) => i * 45);
  readonly sixAngles = Array.from({ length: 6 }, (_, i) => i * 60);

  readonly stemStartY = computed(() => {
    switch (this.type()) {
      case 'rose':
        return 14;
      case 'tulip':
        return 10;
      case 'sunflower':
        return 9;
      case 'peony':
        return 14;
      case 'gerbera':
        return 7;
      default:
        return 12;
    }
  });
}
