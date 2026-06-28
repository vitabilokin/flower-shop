import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: `
    <span class="app-logo" [style.fontSize.px]="size()" [style.color]="color()">
      <span>P</span>
      <svg [attr.width]="size() * 0.7" [attr.height]="size() * 0.7" viewBox="0 0 30 30">
        <g fill="#ff4d8d">
          <circle cx="15" cy="7" r="5" />
          <circle cx="22.61" cy="12.53" r="5" />
          <circle cx="19.7" cy="21.47" r="5" />
          <circle cx="10.3" cy="21.47" r="5" />
          <circle cx="7.39" cy="12.53" r="5" />
        </g>
        <circle cx="15" cy="15" r="5" fill="#ffce3f" />
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
