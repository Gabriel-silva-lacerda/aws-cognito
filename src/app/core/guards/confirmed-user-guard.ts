import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { CognitoService } from "../../shared/services/cognito/cognito.service";

@Injectable({ providedIn: 'root' })
export class ConfirmedUserGuard implements CanActivate {
  private router = inject(Router);
  private cognito = inject(CognitoService);

  async canActivate(): Promise<boolean> {
    const user = await this.cognito.getCurrentUser();
    if (!user?.email_verified) {
      this.router.navigateByUrl('/auth/confirm');
      return false;
    }
    return true;
  }
}
