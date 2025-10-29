import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@core/pages/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  async canActivate(): Promise<boolean> {
    const user = this.authService.user();

    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/auth/signin');
      return false;
    }

    if (!user?.email_verified) {
      this.router.navigateByUrl('/auth/confirm');
      return false;
    }

    return true;
  }
}
