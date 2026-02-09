import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth.guard';
import { guestGuard } from '@core/guards/guest.guard';

import { AdminLayoutComponent, AuthLayoutComponent } from '@core/layouts';
import { LoginComponent } from '@features/auth';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
        title: 'EShop - Login'
      },
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('@features/admin/admin.routes').then((r) => r.adminRoutes)
  }
];
