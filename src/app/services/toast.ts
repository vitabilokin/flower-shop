import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Toast {
  readonly message = signal<string | null>(null);
  private hideTimeout?: ReturnType<typeof setTimeout>;

  show(message: string, duration = 3200): void {
    clearTimeout(this.hideTimeout);
    this.message.set(message);
    this.hideTimeout = setTimeout(() => this.message.set(null), duration);
  }
}
