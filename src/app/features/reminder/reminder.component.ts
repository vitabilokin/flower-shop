import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReminderService } from '../../core/services/reminder.service';

type ContactMethod = 'phone' | 'telegram';

const PREFIX: Record<ContactMethod, string> = {
  phone: '+38',
  telegram: '@',
};

const PHONE_DIGITS = 10;

const MIN_CONTACT_LENGTH: Record<ContactMethod, number> = {
  phone: PREFIX.phone.length + PHONE_DIGITS,
  telegram: 4,
};

const MAX_CONTACT_LENGTH: Record<ContactMethod, number> = {
  phone: PREFIX.phone.length + PHONE_DIGITS,
  telegram: 33,
};

@Component({
  standalone: true,
  selector: 'app-reminder',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSnackBarModule],
  templateUrl: './reminder.component.html',
  styleUrl: './reminder.component.scss',
})
export class ReminderComponent {
  private readonly _snackBar = inject(MatSnackBar);
  private readonly reminderService = inject(ReminderService);

  readonly contactMethod = signal<ContactMethod>('phone');
  readonly contactMinLength = computed(() => MIN_CONTACT_LENGTH[this.contactMethod()]);
  readonly contactMaxLength = computed(() => MAX_CONTACT_LENGTH[this.contactMethod()]);
  readonly submitting = signal(false);

  readonly minDate = new Date();

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

  onContactChange(value: string): void {
    const method = this.contactMethod();
    const prefix = PREFIX[method];
    const body = value.startsWith(prefix) ? value.slice(prefix.length) : value;

    this.contact = method === 'phone' ? prefix + body.replace(/\D/g, '').slice(0, PHONE_DIGITS) : prefix + body.replace(/@/g, '');
  }

  async submit(form: NgForm): Promise<void> {
    if (form.invalid || !this.date) {
      Object.values(form.controls).forEach((control) => control.markAsTouched());
      return;
    }

    try {
      this.submitting.set(true);
      await this.reminderService.submitReminder({ name: this.name, date: this.date, contact: this.contact });

      this._snackBar.open('Дякуємо! Ми нагадаємо вчасно 🌸', 'Закрити', {
        duration: 3200,
        panelClass: ['posy-snackbar'],
      });
      this.name = '';
      this.date = null;
      this.contact = PREFIX[this.contactMethod()];
      form.resetForm({ contact: this.contact });
    } catch {
      this._snackBar.open('Не вдалося надіслати заявку, спробуйте ще раз', 'Закрити', {
        duration: 3200,
        panelClass: ['posy-snackbar'],
      });
    } finally {
      this.submitting.set(false);
    }
  }
}
