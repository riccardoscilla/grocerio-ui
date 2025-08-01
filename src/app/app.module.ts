import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { PrimeNgModule } from './components/modules/primeng.module';
import { BaseComponentsModule } from './components/modules/base-components.module';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Interceptor } from './auth/interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ShelfComponent } from './pages/shelf/shelf.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ItemComponent } from './pages/item/item.component';
import { ShelfNewComponent } from './pages/shelf/shelf-item-new.component';
import { ShelfEditComponent } from './pages/shelf/shelf-item-edit.component';
import { ShelfDeleteComponent } from './pages/shelf/shelf-delete.component';
import { GroceryComponent } from './pages/grocery/grocery.component';
import { GroceryNewComponent } from './pages/grocery/grocery-item-new.component';
import { GroceryEditComponent } from './pages/grocery/grocery-item-edit.component';
import { ItemNewComponent } from './pages/item/item-new.component';
import { ItemEditComponent } from './pages/item/item-edit.component';
import { MoreComponent } from './pages/more/more.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { GroceryDeleteComponent } from './pages/grocery/grocery-delete.component';
import { ShareShelfComponent } from './pages/share-shelf/share-shelf.component';
import { CategoryComponent } from './pages/category/category.component';
import { CategoryNewComponent } from './pages/category/category-new.component';
import { CategoryEditComponent } from './pages/category/category-edit.component';
import { TimerPageComponent } from './pages/timer/timer.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ShelfJoinComponent } from './pages/register/shelf-join.component';
import { ItemDeleteComponent } from './pages/item/item-delete.component';
import { CategoryDeleteComponent } from './pages/category/category-delete.component';
import { AppComponentsModule } from './components/modules/app-components.module';

@NgModule({
  declarations: [
    AppComponent,

    LoginComponent,

    RegisterComponent,

    ShelfJoinComponent,

    ShelfComponent,
    ShelfNewComponent,
    ShelfEditComponent,
    ShelfDeleteComponent,

    GroceryComponent,
    GroceryNewComponent,
    GroceryEditComponent,
    GroceryDeleteComponent,

    ItemComponent,
    ItemNewComponent,
    ItemEditComponent,
    ItemDeleteComponent,

    CategoryComponent,
    CategoryNewComponent,
    CategoryEditComponent,
    CategoryDeleteComponent,

    MoreComponent,
    ShareShelfComponent,
    TimerPageComponent,
    WelcomeComponent,

    ...BaseComponentsModule,
    ...AppComponentsModule
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    PrimeNgModule,
    HttpClientModule,
    ToastModule,
    SkeletonModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true,
    },
    ConfirmationService,
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
