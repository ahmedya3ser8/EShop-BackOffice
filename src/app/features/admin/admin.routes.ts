import { Routes } from "@angular/router";

import {
  DashboardComponent,
  OrdersComponent,
  ProductsComponent
} from '@features/admin';

export const adminRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'EShop - Dashboard'
  },
  {
    path: 'products',
    component: ProductsComponent,
    title: 'EShop - Products'
  },
  {
    path: 'brands',
    loadChildren: () => import('./pages/brands/brands.routes').then(r => r.brandRoutes),
    title: 'EShop - Brands'
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.routes').then(r => r.categoryRoutes),
    title: 'EShop - Categories'
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.routes').then(r => r.userRoutes),
    title: 'EShop - Users'
  },
  {
    path: 'orders',
    component: OrdersComponent,
    title: 'EShop - Orders'
  },
  {
    path: 'subcategories',
    loadChildren: () => import('./pages/sub-categories/subCategories.routes').then(r => r.subCategoryRoutes),
    title: 'EShop - SubCategories'
  },
]
