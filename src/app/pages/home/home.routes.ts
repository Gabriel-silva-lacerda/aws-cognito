import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard],
  },
];
