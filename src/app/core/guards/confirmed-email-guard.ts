import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class ConfirmEmailGuard implements CanActivate {
  private router = inject(Router);

  canActivate(): boolean {
    const storedEmail = localStorage.getItem('confirmEmail');

    if (!storedEmail) {
      this.router.navigateByUrl('/auth/signin');
      return false;
    }

    return true;
  }
}
