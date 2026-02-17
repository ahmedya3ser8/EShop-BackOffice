import { Routes } from "@angular/router";

import { CategoryListComponent } from "./components/category-list/category-list.component";
import { CategoryFormComponent } from "./components/category-form/category-form.component";
import { CategoryDetailsComponent } from "./components/category-details/category-details.component";

export const categoryRoutes: Routes = [
  {
    path: '',
    component: CategoryListComponent,
    title: 'EShop - CategoryList'
  },
  {
    path: 'add',
    component: CategoryFormComponent,
    title: 'EShop - New Category'
  },
  {
    path: 'view/:id',
    component: CategoryDetailsComponent,
    title: 'EShop - Category Details'
  },
  {
    path: 'edit/:id',
    component: CategoryFormComponent,
    title: 'EShop - Category Details'
  }
]
