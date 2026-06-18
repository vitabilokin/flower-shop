import { Component, inject } from '@angular/core';
import { Toast as ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class ToastComponent {
  private readonly toast = inject(ToastService);
  readonly message = this.toast.message;
}
