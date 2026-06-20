import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contacts',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
  private readonly _snackBar = inject(MatSnackBar);

  name = '';
  date: Date | null = null;
  contact = '';

  submit(): void {
    this._snackBar.open('Дякуємо! Ми нагадаємо вчасно 🌸', 'Закрити', {
      duration: 3200,
      panelClass: ['posy-snackbar'],
    });
    this.name = '';
    this.date = null;
    this.contact = '';
  }
}
