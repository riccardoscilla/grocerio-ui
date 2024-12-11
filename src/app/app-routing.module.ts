import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShelfComponent } from './pages/shelf/shelf.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './auth/auth.guard';
import { ItemsComponent } from './pages/items/items.component';
import { GroceryComponent } from './pages/grocery/grocery.component';
import { OtherComponent } from './pages/other/other.component';

const routes: Routes = [
  { path: '', redirectTo: '/shelf', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'shelf', component: ShelfComponent, canActivate: [AuthGuard] },

  { path: 'grocery', component: GroceryComponent, canActivate: [AuthGuard] },
 
  { path: 'other', component: OtherComponent, canActivate: [AuthGuard] },

  { path: 'items', component: ItemsComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
