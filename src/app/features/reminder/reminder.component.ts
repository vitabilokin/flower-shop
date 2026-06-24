import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

type ContactMethod = 'phone' | 'telegram';

const PREFIX: Record<ContactMethod, string> = {
  phone: '+380',
  telegram: '@',
};

@Component({
  selector: 'app-reminder',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSnackBarModule],
  templateUrl: './reminder.component.html',
  styleUrl: './reminder.component.scss',
})
export class ReminderComponent {
  private readonly _snackBar = inject(MatSnackBar);

  readonly contactMethod = signal<ContactMethod>('phone');

  name = '';
  date: Date | null = null;
  contact = PREFIX.phone;

  setContactMethod(method: ContactMethod): void {
    if (this.contactMethod() === method) {
      return;
    }
    this.contactMethod.set(method);
    this.contact = PREFIX[method];
  }

  submit(): void {
    this._snackBar.open('Дякуємо! Ми нагадаємо вчасно 🌸', 'Закрити', {
      duration: 3200,
      panelClass: ['posy-snackbar'],
    });
    this.name = '';
    this.date = null;
    this.contact = PREFIX[this.contactMethod()];
  }
}
