import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs';

// Reads authState directly (instead of AuthService's signal) and waits for its first
// emission — on a fresh page load the signal would still be in its initial "undefined"
// state while Firebase is restoring the session, which would wrongly bounce a logged-in
// admin back to /admin/login.
export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    map((user) => (user ? true : router.createUrlTree(['/admin/login']))),
  );
};
