import { Routes } from '@angular/router';
import { ConfirmEmailGuard } from '@core/guards/confirmed-email-guard';
import { GuestGuard } from '@core/guards/guest.guard';

export const authRoutes: Routes = [
  {
    path: 'signin',
    loadComponent: () =>
      import('./pages/sign-in/sign-in.page').then(m => m.SignInPage),
    canActivate: [GuestGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/sign-up/sign-up.page').then((m) => m.SignUpPage),
    canActivate: [GuestGuard],

  },
  {
    path: 'confirm',
    loadComponent: () =>
      import('./pages/confirm-code/confirm-code.page').then(m => m.ConfirmCodePage),
    canActivate: [ConfirmEmailGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage),
    canActivate: [GuestGuard],
  },
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full',
  },
];
