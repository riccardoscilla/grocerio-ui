import { Component, OnInit } from '@angular/core';
import { CategoriesData, ItemsData } from '../../data/data';
import { ToastService } from '../../services/toast.service';
import { DataStateHandler } from '../../data/dataStateHandler';
import { HttpErrorResponse } from '@angular/common/http';
import { Item } from '../../model/item';
import { Category } from '../../model/category';
import { ApiService } from '../../services/api.service';
import { catchError, forkJoin, of, tap } from 'rxjs';

@Component({
  selector: 'app-item',
  template: `
    <app-title [title]="'Items'" [back]="'/more'"></app-title>

    <!-- <app-appbar>
        <div style="display: flex; gap: 8px;">
            <app-search-bar (searchTextChanged)="onSearchTextChanged($event)" style="flex: 1;"></app-search-bar>
            
            <app-filter-button
                [selectedCategories]="itemsData.selectedCategories" 
                (toggleFilter)="toggleShowCategoryFilter()" >
            </app-filter-button>
        </div>
    </app-appbar> -->

    <app-container [padding]="'16px'" *ngIf="dataStateHandler.isSuccess()">
      <app-list>
        <app-list-item
          *ngFor="let item of itemsData.filteredItems"
          [icon]="item.icon"
          [favourite]="item.favourite"
          [contentText]="item.name"
          (edit)="onEdit(item)"
        >
        </app-list-item>
      </app-list>

      <app-row *ngIf="itemsData.isEmpty()">No Items</app-row>
    </app-container>

    <app-list-loading *ngIf="dataStateHandler.isLoading()"></app-list-loading>

    <app-fixed-bottom-right>
      <app-new-button (toggleShowNew)="onNew()"></app-new-button>
    </app-fixed-bottom-right>

    <app-menu-bottom></app-menu-bottom>

    <app-item-new
      *ngIf="showItemNew"
      [(visible)]="showItemNew"
      [item]="itemNew"
      [categoriesData]="categoriesData"
      (onSaved)="savedItem($event)"
    ></app-item-new>

    <app-item-edit
      *ngIf="showItemEdit"
      [(visible)]="showItemEdit"
      [item]="itemEdit"
      [categoriesData]="categoriesData"
      (onEdited)="editedItem($event)"
      (onDeleted)="deletedItem($event)"
    >
    </app-item-edit>
  `,
})
export class ItemComponent implements OnInit {
  itemsData: ItemsData = new ItemsData();
  categoriesData: CategoriesData = new CategoriesData();
  dataStateHandler: DataStateHandler = new DataStateHandler();

  showItemNew = false;
  itemNew: Item;

  showItemEdit = false;
  itemEdit: Item;

  showCategoryFilter = false;

  constructor(
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.initLoad();
  }

  initLoad() {
    forkJoin({
      categories: this.getCategories(),
      items: this.getItems(),
    }).subscribe({
      next: (results) => {
        this.toastService.handleResults(results);
      },
    });
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
    this.itemsData.itemName = searchText;
    this.itemsData.filter();
  }

  onNew() {
    this.itemNew = Item.new();
    this.showItemNew = true;
  }

  onEdit(item: Item) {
    this.itemEdit = item.deepcopy();
    this.showItemEdit = true;
  }

  onApplyCategoryFilter(categories: Category[]) {
    this.itemsData.selectedCategories = [...categories];
    this.itemsData.filter();
    this.showCategoryFilter = false;
  }

  // ACTIONS
  editedItem(item: Item) {
    this.itemsData.update([item]);
  }

  savedItem(item: Item) {
    this.itemsData.update([item]);
  }

  deletedItem(item: Item) {
    this.itemsData.delete([item]);
  }
}
