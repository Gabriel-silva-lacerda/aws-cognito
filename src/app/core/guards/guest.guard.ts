import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CognitoService } from '@shared/services/cognito/cognito.service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  private router = inject(Router);
  private cognitoService = inject(CognitoService);

  async canActivate(): Promise<boolean> {
    const session = await this.cognitoService.getSession();
    const isAuthenticated = !!session?.tokens?.idToken;

    if (isAuthenticated) {
      await this.router.navigate(['/'], { replaceUrl: true });
      return false;
    }

    return true;
  }
}
