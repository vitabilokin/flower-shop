import { Component, inject } from '@angular/core';
import { Toast as ToastService } from '../../../core/services/toast';

@Component({
  standalone: true,
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  private readonly toast = inject(ToastService);
  readonly message = this.toast.message;
}
