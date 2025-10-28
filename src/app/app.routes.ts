import { Routes } from '@angular/router';
import { MainComponent } from './core/pages/main/main.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/pages/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '',
    loadComponent: () => MainComponent,
    children: [
      { path: '',
        loadChildren: () =>
          import('./pages/home/home.routes').then(m => m.homeRoutes)
      },
    ],
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];
