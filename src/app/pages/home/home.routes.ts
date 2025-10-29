import { Routes } from '@angular/router';
import { ConfirmedUserGuard } from '../../core/guards/confirmed-user-guard';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [ConfirmedUserGuard],
  },
];
