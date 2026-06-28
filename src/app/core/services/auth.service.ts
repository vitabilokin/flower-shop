import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, authState, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);

  readonly user = toSignal(authState(this.auth), { initialValue: undefined });
  readonly isLoggedIn = computed(() => !!this.user());

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    return signOut(this.auth);
  }
}
