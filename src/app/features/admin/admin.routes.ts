import { Routes } from "@angular/router";

import {
  BrandsComponent,
  CategoriesComponent,
  DashboardComponent,
  OrdersComponent,
  ProductsComponent,
  SubCategoriesComponent,
  UsersComponent
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
    component: BrandsComponent,
    title: 'EShop - Brands'
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    title: 'EShop - Categories'
  },
  {
    path: 'users',
    component: UsersComponent,
    title: 'EShop - Users'
  },
  {
    path: 'orders',
    component: OrdersComponent,
    title: 'EShop - Orders'
  },
  {
    path: 'sub-categories',
    component: SubCategoriesComponent,
    title: 'EShop - SubCategories'
  },
]
