import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-contacts',
  imports: [FormsModule],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
  private readonly toast = inject(Toast);

  name = '';
  date = '';
  contact = '';

  submit(): void {
    this.toast.show('Дякуємо! Ми нагадаємо вчасно 🌸');
    this.name = '';
    this.date = '';
    this.contact = '';
  }
}
