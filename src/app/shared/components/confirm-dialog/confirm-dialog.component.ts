import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule],
  template: `
    <h2 class="confirm__title">{{ data.title }}</h2>
    <p class="confirm__message">{{ data.message }}</p>
    <div mat-dialog-actions class="confirm__actions">
      <button type="button" class="confirm__btn confirm__btn--ghost" (click)="dialogRef.close(false)">
        {{ data.cancelLabel ?? 'Скасувати' }}
      </button>
      <button
        type="button"
        class="confirm__btn"
        [class.confirm__btn--danger]="data.danger"
        [class.confirm__btn--pink]="!data.danger"
        (click)="dialogRef.close(true)"
      >
        {{ data.confirmLabel ?? 'Підтвердити' }}
      </button>
    </div>
  `,
  styles: `
    .confirm__title {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: var(--text-lg);
      color: var(--ink);
      margin: 0;
      padding: var(--space-4) var(--space-5) 0;
    }

    .confirm__message {
      padding: var(--space-2) var(--space-5) 0;
      color: var(--muted);
      font-size: var(--text-sm);
      line-height: 1.5;
      max-width: 380px;
    }

    .confirm__actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-2);
      padding: var(--space-4) var(--space-5);
    }

    .confirm__btn {
      padding: 0.7rem 1.4rem;
      border-radius: var(--radius-pill);
      font-weight: 700;
      font-size: var(--text-sm);
      transition: background-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
    }

    .confirm__btn--ghost {
      background: transparent;
      color: var(--muted);
      border: 1.5px solid var(--line-strong);
    }

    .confirm__btn--ghost:hover {
      background: var(--paper-3);
    }

    .confirm__btn--pink {
      background: var(--pink);
      color: white;
    }

    .confirm__btn--pink:hover {
      background: var(--pink-press);
    }

    .confirm__btn--danger {
      background: #e53935;
      color: white;
    }

    .confirm__btn--danger:hover {
      background: #c62828;
    }
  `,
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent, boolean>);
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
