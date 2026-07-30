import { Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-logo',
  template: `
    <span class="app-logo" [style.fontSize.px]="size()" [style.color]="color()">
      <span>P</span>
      <svg [attr.width]="size() * 0.82" [attr.height]="size() * 0.82" viewBox="0 0 30 30">
        <defs>
          <mask id="posy-flower-mask">
            <circle cx="15" cy="6"     r="6" fill="white"/>
            <circle cx="23.56" cy="12.22" r="6" fill="white"/>
            <circle cx="20.29" cy="22.28" r="6" fill="white"/>
            <circle cx="9.71"  cy="22.28" r="6" fill="white"/>
            <circle cx="6.44"  cy="12.22" r="6" fill="white"/>
            <circle cx="15"    cy="15"    r="5.2" fill="black"/>
          </mask>
        </defs>
        <rect x="0" y="0" width="30" height="30" [attr.fill]="color()" mask="url(#posy-flower-mask)"/>
      </svg>
      <span>sy</span>
    </span>
  `,
  styles: `
    .app-logo {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-family: var(--font-display);
      font-weight: 800;
      letter-spacing: -0.01em;

      svg {
        flex-shrink: 0;
      }
    }
  `,
})
export class Logo {
  readonly size = input(28);
  readonly color = input('#ff4d8d');
}
