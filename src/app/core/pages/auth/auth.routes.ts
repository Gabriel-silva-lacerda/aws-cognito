import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'signin',
    loadComponent: () =>
      import('./pages/sign-in/sign-in.page').then(m => m.SignInPage),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/sign-up/sign-up.page').then((m) => m.SignUpPage),
  },
  {
    path: 'confirm',
    loadComponent: () =>
      import('./pages/confirm-code/confirm-code.page').then(m => m.ConfirmCodePage),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage),
  },
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full',
  },
];
