import { Routes } from "@angular/router";

import { UserListComponent } from "./components/user-list/user-list.component";
import { UserFormComponent } from "./components/user-form/user-form.component";
import { UserDetailsComponent } from "./components/user-details/user-details.component";

export const userRoutes: Routes = [
  {
    path: '',
    component: UserListComponent,
    title: 'EShop - UserList'
  },
  {
    path: 'add',
    component: UserFormComponent,
    title: 'EShop - New User'
  },
  {
    path: 'view/:id',
    component: UserDetailsComponent,
    title: 'EShop - User Details'
  },
  {
    path: 'edit/:id',
    component: UserFormComponent,
    title: 'EShop - User Details'
  }
]
