import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@core/pages/auth/services/auth.service';
import { CognitoService } from '@shared/services/cognito/cognito.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);
  private cognitoService = inject(CognitoService);

  async canActivate(): Promise<boolean> {
    try {
      const session = await this.cognitoService.getSession();
      const user = await this.cognitoService.getCurrentUser();

      if (!session || !session.tokens?.idToken) {
        this.router.navigateByUrl('/auth/signin');
        return false;
      }

      if (!user?.email_verified) {
        this.router.navigateByUrl('/auth/confirm');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar sessão', error);
      this.router.navigateByUrl('/auth/signin');
      return false;
    }
  }
}
