import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/profile/profile.component').then(m => m.ProfileComponent),
  },
];
