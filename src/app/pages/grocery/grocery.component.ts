import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';
import { CategoriesData, ItemsData, GroceryItemsData } from '../../data/data';
import { DataStateHandler } from '../../data/dataStateHandler';
import { forkJoin } from 'rxjs';
import { GroceryItem } from '../../model/groceryItem';
import { ApiService } from '../../services/api.service';
import { Category } from '../../model/category';
import { CheckboxChangeEvent } from 'primeng/checkbox';

@Component({
  selector: 'app-grocery',
  template: `
    <app-scaffold (onRefresh)="initLoad()">
      <app-round-top-container appbar>
        <app-title [title]="'Grocery List'" [onPrimary]="true" />
      </app-round-top-container>
      
      <app-container content [padding]="'16px'" *ngIf="dataStateHandler.isSuccess()">
        <app-list>
          @for (groceryItem of groceryItemsData.filteredGroceryItems; track groceryItem.id) {
            <app-list-tile>
              <app-category-icon leading [icon]="groceryItem.icon" [favourite]="groceryItem.item.favourite" />
              <div content>{{groceryItem.name}}</div>
              <p-checkbox trailing [(ngModel)]="groceryItem.inCart" (onChange)="onCheck(groceryItem, $event)" [binary]="true"/>
            </app-list-tile>
          }
        </app-list>

        <app-row *ngIf="groceryItemsData.isEmpty()">No Grocery Items</app-row>
      </app-container>

      <app-list-loading content *ngIf="dataStateHandler.isLoading()"></app-list-loading>

      <app-new-button fab (toggleShowNew)="onNew()"></app-new-button>
      <p-button fab2 (click)="onFinish()">
          <ng-template pTemplate="icon">
              <app-svg [color]="'white'" [size]="20" [path]="'cart-shopping-fast.svg'"></app-svg>
          </ng-template>
      </p-button>

      <app-menu-bottom bottomtabbar />
    </app-scaffold>

    <app-grocery-new
      *ngIf="showGroceryItemNew"
      [itemsData]="itemsData"
      [categoriesData]="categoriesData"
      (onClosed)="showGroceryItemNew = false"
      (onSaved)="savedGroceryItems($event)"
    />

    <app-grocery-edit
      *ngIf="showGroceryItemEdit"
      [groceryItem]="groceryItemEdit"
      [itemsData]="itemsData"
      [categoriesData]="categoriesData"
      (onClosed)="showGroceryItemEdit = false"
      (onEdited)="editedGroceryItem($event)"
      (onDeleted)="deletedShelfItem($event)"
    />
  `,
})
export class GroceryComponent {
  groceryItemsData: GroceryItemsData = new GroceryItemsData();
  categoriesData: CategoriesData = new CategoriesData();
  itemsData: ItemsData = new ItemsData();
  dataStateHandler: DataStateHandler = new DataStateHandler();

  showGroceryItemNew = false;
  //groceryItemNew: GroceryItem = GroceryItem.new();

  showGroceryItemEdit = false;
  groceryItemEdit: GroceryItem;

  showCategoryFilter = false;

  constructor(
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
      this.groceryItemsData,
      this.dataStateHandler,
      () => this.apiService.getGroceryItems()
    );
  }

  getCategories() {
    return this.apiService.fetchData(
      this.categoriesData,
      this.dataStateHandler,
      () => this.apiService.getCategories()
    );
  }

  getItems() {
    return this.apiService.fetchData(
      this.itemsData,
      this.dataStateHandler,
      () => this.apiService.getItems()
    );
  }

  // HANDLES

  onSearchTextChanged(searchText: string) {
    this.groceryItemsData.searchText = searchText;
    this.groceryItemsData.filter();
  }

  onNew() {
    this.showGroceryItemNew = true;
  }

  onEdit(groceryItem: GroceryItem) {
    this.groceryItemEdit = groceryItem.deepcopy();
    this.showGroceryItemEdit = true;
  }

  onApplyCategoryFilter(categories: Category[]) {
    this.groceryItemsData.selectedCategories = [...categories];
    this.groceryItemsData.filter();
    this.showCategoryFilter = true;
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
        this.groceryItemsData.update([groceryItem]);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error List items checked');
        // rollback
        groceryItem.inCart = !check.checked;
      },
    });
  }

  onFinish() {
    this.apiService.moveCartInShelf().subscribe({
      next: () => {
        this.toastService.handleSuccess('List items moved in shelf!');
        this.getGroceryItems().subscribe();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error moving List items in shelf');
      },
    });
  }

  // ACTIONS

  editedGroceryItem(groceryItem: GroceryItem) {
    this.groceryItemsData.update([groceryItem]);
  }

  savedGroceryItems(groceryItems: GroceryItem[]) {
    this.groceryItemsData.update(groceryItems);
  }

  deletedShelfItem(groceryItem: GroceryItem) {
    this.groceryItemsData.delete([groceryItem]);
  }
}
