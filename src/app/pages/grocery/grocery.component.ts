import { Component, computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';
import { DataStateHandler } from '../../data/dataStateHandler';
import { forkJoin } from 'rxjs';
import { GroceryItem } from '../../model/groceryItem';
import { ApiService } from '../../services/api.service';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-grocery',
  template: `
    <app-scaffold (onRefresh)="initLoad()">
      <app-round-top-container appbar>
        <app-title [title]="'Grocery List'" [onPrimary]="true" />
      </app-round-top-container>
      
      <app-container content [padding]="'16px'" *ngIf="dataStateHandler.isSuccess()">
        <app-list>
          @for (groceryItem of filteredGroceryItems(); track groceryItem.id) {
            <app-list-tile (onClick)="onOpenEdit(groceryItem)">
              <app-category-icon leading [icon]="groceryItem.icon" [favourite]="groceryItem.item.favourite" />
              <div content>{{groceryItem.name}}</div>
              <p-checkbox trailing [(ngModel)]="groceryItem.inCart" (onChange)="onCheck(groceryItem, $event)" [binary]="true"/>
            </app-list-tile>
          }
        </app-list>

        <app-row *ngIf="sharedDataService.groceryItemsData.isEmpty()">No Grocery Items</app-row>
      </app-container>

      <app-list-loading content *ngIf="dataStateHandler.isLoading()"></app-list-loading>

      <app-button fab icon="plus.svg" shape="round" size="large" iconSize="20" (onClick)="onOpenNew()"/>
      <app-button fab2 icon="cart-shopping-fast.svg" iconSize="16" (onClick)="onFinish()" [visible]="hasGroceryItemsInCart()"/>

      <app-menu-bottom bottomtabbar />
    </app-scaffold>

    <app-grocery-new
      *ngIf="showGroceryItemNew"
      (onClosed)="showGroceryItemNew = false"
    />

    <app-grocery-edit
      *ngIf="showGroceryItemEdit"
      [groceryItem]="groceryItemEdit"
      (onClosed)="showGroceryItemEdit = false"
    />
  `,
})
export class GroceryComponent {
  dataStateHandler: DataStateHandler = new DataStateHandler();

  showGroceryItemNew = false;
  showGroceryItemEdit = false;
  groceryItemEdit: GroceryItem;

  filteredGroceryItems = computed(() =>
    this.sharedDataService.groceryItemsData.filter()
  );

  constructor(
    public sharedDataService: SharedDataService,
    public apiService: ApiService,
    private toastService: ToastService
  ) {
    this.initLoad();
  }

  initLoad() {
    forkJoin({
      groceryItems: this.getGroceryItems(),
      categories: this.getCategories(),
      items: this.getItems(),
    }).subscribe({
      next: (results) => {
        this.toastService.handleResults(results);
      },
    });
  }

  getGroceryItems() {
    return this.apiService.fetchData(
      this.sharedDataService.groceryItemsData,
      this.dataStateHandler,
      () => this.apiService.getGroceryItems()
    );
  }

  getCategories() {
    return this.apiService.fetchData(
      this.sharedDataService.categoriesData,
      this.dataStateHandler,
      () => this.apiService.getCategories()
    );
  }

  getItems() {
    return this.apiService.fetchData(
      this.sharedDataService.itemsData,
      this.dataStateHandler,
      () => this.apiService.getItems()
    );
  }

  // HANDLES

  onOpenNew() {
    this.showGroceryItemNew = true;
  }

  onOpenEdit(groceryItem: GroceryItem) {
    this.groceryItemEdit = groceryItem.deepcopy();
    this.showGroceryItemEdit = true;
  }

  onCheck(groceryItem: GroceryItem, check: CheckboxChangeEvent) {
    const data = {
      id: groceryItem.id,
      itemId: groceryItem.item.id,
      quantity: groceryItem.quantity,
      insertionDate: groceryItem.insertionDate,
      note: groceryItem.note,
      inCart: check.checked,
    };

    this.apiService.editGroceryItem(groceryItem.id, data).subscribe({
      next: (groceryItem: GroceryItem) => {
        // this.toastService.handleSuccess('List items checked!');
        this.sharedDataService.groceryItemsData.update([groceryItem]);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error Grocery items checked');
        // rollback
        groceryItem.inCart = !check.checked;
      },
    });
  }

  onFinish() {
    this.apiService.moveCartInShelf().subscribe({
      next: () => {
        this.toastService.handleSuccess('Grocery items moved in shelf!');
        this.getGroceryItems().subscribe();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error moving Grocery items in shelf');
      },
    });
  }

  hasGroceryItemsInCart() {
    return this.sharedDataService.groceryItemsData.data().some(item => item.inCart);
  }
}
