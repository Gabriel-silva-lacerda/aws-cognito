import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@core/pages/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.router.navigateByUrl('/');
      return false;
    }

    return true;
  }
}
