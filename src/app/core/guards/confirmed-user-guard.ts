import { AuthService } from '@core/pages/auth/services/auth.service';
import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { firstValueFrom, filter, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfirmedUserGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  async canActivate(): Promise<boolean> {
    // const user = await this.cognitoService.getCurrentUser();

    const user = this.authService.user();
    if (!user?.email_verified) {
      this.router.navigateByUrl('/auth/confirm');
      return false;
    }
    return true;
  }
}
