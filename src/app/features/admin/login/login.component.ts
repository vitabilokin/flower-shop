import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';
import { Logo } from '../../../shared/components/logo/logo';

@Component({
  standalone: true,
  selector: 'app-admin-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, Logo],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly email = signal('');
  readonly password = signal('');
  readonly loading = signal(false);
  readonly error = signal('');

  readonly mode = signal<'login' | 'reset' | 'reset-success'>('login');
  readonly resetEmail = signal('');
  readonly resetLoading = signal(false);
  readonly resetError = signal('');
  readonly resetSuccessEmail = signal('');

  async login(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set('');
      await this.authService.login(this.email(), this.password());
      this.router.navigate(['/admin']);
    } catch {
      this.error.set('Невірний email або пароль');
    } finally {
      this.loading.set(false);
    }
  }

  showResetForm(): void {
    this.resetEmail.set(this.email());
    this.resetError.set('');
    this.mode.set('reset');
  }

  async resetPassword(): Promise<void> {
    try {
      this.resetLoading.set(true);
      this.resetError.set('');
      await this.authService.resetPassword(this.resetEmail());
      this.resetSuccessEmail.set(this.resetEmail());
      this.mode.set('reset-success');
    } catch {
      this.resetError.set('Не вдалось надіслати лист. Перевірте email.');
    } finally {
      this.resetLoading.set(false);
    }
  }
}
