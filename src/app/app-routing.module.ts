import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShelfComponent } from './pages/shelf/shelf.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './auth/auth.guard';
import { ItemComponent } from './pages/item/item.component';
import { GroceryComponent } from './pages/grocery/grocery.component';
import { MoreComponent } from './pages/more/more.component';
import { ShareShelfComponent } from './pages/share-shelf/share-shelf.component';
import { CategoryComponent } from './pages/category/category.component';
import { TimerPageComponent } from './pages/timer/timer.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ShelfJoinComponent } from './pages/register/shelf-join.component';
import { TestComponent } from './components/base/_test.component';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },

  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'shelf-join', component: ShelfJoinComponent, canActivate: [AuthGuard] },

  { path: 'shelf', component: ShelfComponent, canActivate: [AuthGuard] },

  { path: 'grocery', component: GroceryComponent, canActivate: [AuthGuard] },

  { path: 'more', component: MoreComponent, canActivate: [AuthGuard] },
  { path: 'share-shelf', component: ShareShelfComponent, canActivate: [AuthGuard] },

  { path: 'items', component: ItemComponent, canActivate: [AuthGuard] },
  { path: 'categories', component: CategoryComponent, canActivate: [AuthGuard] },

  { path: 'timer', component: TimerPageComponent, canActivate: [AuthGuard] },

  
  { path: 'test', component: TestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
