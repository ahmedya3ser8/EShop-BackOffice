import { Routes } from "@angular/router";
import { SubCategoryListComponent } from "./components/sub-category-list/sub-category-list.component";
import { SubCategoryFormComponent } from "./components/sub-category-form/sub-category-form.component";
import { SubCategoryDetailsComponent } from "./components/sub-category-details/sub-category-details.component";

export const subCategoryRoutes: Routes = [
  {
    path: '',
    component: SubCategoryListComponent,
    title: 'EShop - SubCategoryList'
  },
  {
    path: 'add',
    component: SubCategoryFormComponent,
    title: 'EShop - New SubCategory'
  },
  {
    path: 'view/:id',
    component: SubCategoryDetailsComponent,
    title: 'EShop - SubCategory Details'
  },
  {
    path: 'edit/:id',
    component: SubCategoryFormComponent,
    title: 'EShop - SubCategory Details'
  }
]
