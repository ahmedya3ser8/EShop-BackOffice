import { Routes } from "@angular/router";

import { BrandListComponent } from "./components/brand-list/brand-list.component";
import { BrandFormComponent } from "./components/brand-form/brand-form.component";
import { BrandDetailsComponent } from "./components/brand-details/brand-details.component";

export const brandRoutes: Routes = [
  {
    path: '',
    component: BrandListComponent,
    title: 'EShop - BrandList'
  },
  {
    path: 'add',
    component: BrandFormComponent,
    title: 'EShop - New Brand'
  },
  {
    path: 'view/:id',
    component: BrandDetailsComponent,
    title: 'EShop - Brand Details'
  },
  {
    path: 'edit/:id',
    component: BrandFormComponent,
    title: 'EShop - Brand Details'
  }
]
