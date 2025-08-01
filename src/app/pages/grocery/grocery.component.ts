import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';
import { CategoriesData, ItemsData, GroceryItemsData } from '../../data/data';
import { DataStateHandler } from '../../data/dataStateHandler';
import { forkJoin } from 'rxjs';
import { GroceryItem } from '../../model/groceryItem';
import { ApiService } from '../../services/api.service';
import { Category } from '../../model/category';

@Component({
  selector: 'app-grocery',
  template: `
    <app-round-top-container>
      <app-title [title]="'Grocery List'" [onPrimary]="true" />
    </app-round-top-container>

    <app-container [padding]="'16px 24px'" *ngIf="dataStateHandler.isSuccess()">
      <app-list>
        <app-list-item
          *ngFor="let groceryItem of groceryItemsData.filteredGroceryItems"
          [icon]="groceryItem.icon"
          [favourite]="groceryItem.item.favourite"
          [contentText]="groceryItem.name"
          (edit)="onEdit(groceryItem)"
          [showCheckbox]="true"
          [checked]="groceryItem.inCart"
          (check)="onCheck(groceryItem, $event)"
        >
        </app-list-item>
      </app-list>

      <app-row *ngIf="groceryItemsData.isEmpty()">No Grocery Items</app-row>
    </app-container>

    <app-list-loading *ngIf="dataStateHandler.isLoading()"></app-list-loading>

    <app-fixed-bottom-right>
      <app-new-button (toggleShowNew)="onNew()"></app-new-button>
    </app-fixed-bottom-right>

    <app-menu-bottom></app-menu-bottom>

    <app-grocery-new
      *ngIf="showGroceryItemNew"
      [(visible)]="showGroceryItemNew"
      [itemsData]="itemsData"
      [categoriesData]="categoriesData"
      (onSaved)="savedGroceryItems($event)"
    >
    </app-grocery-new>

    <app-grocery-edit
      *ngIf="showGroceryItemEdit"
      [(visible)]="showGroceryItemEdit"
      [groceryItem]="groceryItemEdit"
      [itemsData]="itemsData"
      [categoriesData]="categoriesData"
      (onEdited)="editedGroceryItem($event)"
      (onDeleted)="deletedShelfItem($event)"
    >
    </app-grocery-edit>
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

  onCheck(groceryItem: GroceryItem, check: boolean) {
    const data = {
      id: groceryItem.id,
      itemId: groceryItem.item.id,
      quantity: groceryItem.quantity,
      insertionDate: groceryItem.insertionDate,
      note: groceryItem.note,
      inCart: check,
    };

    this.apiService.editGroceryItem(groceryItem.id, data).subscribe({
      next: (groceryItem: GroceryItem) => {
        this.toastService.handleSuccess('List items checked!');
        this.groceryItemsData.update([groceryItem]);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error List items checked');
      },
    });
  }

  onFinish() {
    this.apiService.endGrocery().subscribe({
      next: () => {
        this.toastService.handleSuccess('List items moved in shelf!');
        this.getGroceryItems().subscribe();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(
          error,
          'Error moving List items in shelf'
        );
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
