import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MenuBottomComponent } from './menu-bottom/menu-bottom.component';

import { PrimeNgModule } from './primeng.module';
import { ListComponent } from "./components/list.component";
import { ShelfComponent } from './pages/shelf/shelf.component';
import { FixedBottomComponent } from './components/fixed-bottom.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Interceptor } from './auth/interceptor';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { ItemsComponent } from './pages/items/items.component';
import { ListItemTileComponent } from './components/list-item-tile.componenet';
import { SvgComponent } from './components/svg.componenet';
import { FixedBottomRightComponent } from './components/fixed-bottom-right.component';
import { TitleComponent } from './components/title.component';
import { ListLoadingComponent } from './components/list-loading.component';
import { SearchBarComponent } from './components/search-bar.component';
import { CategoryFilterComponent } from './components/category-filter.component';
import { ShelfNewComponent } from './pages/shelf/shelf-new.component';
import { ShelfEditomponent } from './pages/shelf/shelf-edit.component';
import { ShelfDeleteComponent } from './pages/shelf/shelf-delete.component';
import { GroceryComponent } from './pages/grocery/grocery.component';
import { AppBarComponent } from './components/appbar.component';
import { ScrollXComponent } from './components/scroll-x.component';
import { NewButtonComponent } from './components/new-button.component';
import { GroceryNewComponent } from './pages/grocery/grocery-new.component';
import { GroceryEditomponent } from './pages/grocery/grocery-edit.component';
import { CategoryFilterChipComponent } from './components/category-filter-chip.component';
import { ListItemComponent } from './components/list-item.componenet';
import { ItemsNewComponent } from './pages/items/items-new.component';
import { ItemsEditComponent } from './pages/items/items-edit.component';
import { OtherComponent } from './pages/other/other.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,

    SvgComponent,
    FixedBottomComponent,
    FixedBottomRightComponent,
    ScrollXComponent,

    ListComponent,
    ListItemTileComponent,
    ListItemComponent,

    TitleComponent,
    AppBarComponent,
    ListLoadingComponent,
    SearchBarComponent,
    NewButtonComponent,
    
    CategoryFilterComponent,
    CategoryFilterChipComponent,
  
    LoginComponent,

    RegisterComponent,

    MenuBottomComponent,

    ShelfComponent,
    ShelfNewComponent,
    ShelfEditomponent,
    ShelfDeleteComponent,

    GroceryComponent,
    GroceryNewComponent,
    GroceryEditomponent,

    ItemsComponent,
    ItemsNewComponent,
    ItemsEditComponent,

    OtherComponent,
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
    HammerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
    ConfirmationService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


// import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

// export class MyHammerConfig extends HammerGestureConfig  {
//   overrides = <any>{
//       // override hammerjs default configuration
//       'swipe': { direction: Hammer.DIRECTION_ALL  }
//   }
// }