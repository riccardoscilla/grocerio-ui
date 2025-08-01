import { Component, OnInit } from '@angular/core';
import { ShelfItem } from '../../model/shelfItem';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';
import {
  CategoriesData,
  ItemsData,
  ShelfData,
  ShelfItemsData,
} from '../../data/data';
import { DataStateHandler } from '../../data/dataStateHandler';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Category } from '../../model/category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shelf',
  template: `

    <app-round-top-container>
      <app-title [title]="shelfData.shelf?.name" [defaultTitle]="'Shelf'" [onPrimary]="true"/> v1.1
    </app-round-top-container>

    <!-- <app-appbar>
        <div style="display: flex; gap: 8px;">
            <app-search-bar (searchTextChanged)="onSearchTextChanged($event)" style="flex: 1;"></app-search-bar>
            
            <app-filter-button
                [selectedCategories]="shelfItemsData.selectedCategories" 
                (toggleFilter)="toggleShowCategoryFilter()" >
            </app-filter-button>
        </div>
    </app-appbar> -->

    <app-container [padding]="'16px 24px'" *ngIf="dataStateHandler.isSuccess()">
      <app-list>
        <app-list-item
          *ngFor="let shelfItem of shelfItemsData.filteredShelfItems"
          [icon]="shelfItem.icon"
          [favourite]="shelfItem.item.favourite"
          [contentText]="shelfItem.name"
          (edit)="onEdit(shelfItem)"
        >
        </app-list-item>
      </app-list>

      <app-row *ngIf="shelfItemsData.isEmpty() && !categoriesData.isEmpty()">
        No Shelf Items
      </app-row>

      <app-row *ngIf="categoriesData.isEmpty()">
        <p-button #fullflex (click)="gotoCategories()">
          Start here to add new Categories
        </p-button>
      </app-row>
    </app-container>

    <app-list-loading *ngIf="dataStateHandler.isLoading()"></app-list-loading>

    <app-fixed-bottom-right *ngIf="!categoriesData.isEmpty()">
      <app-new-button (toggleShowNew)="onNew()"></app-new-button>
    </app-fixed-bottom-right>

    <app-menu-bottom></app-menu-bottom>

    <app-shelf-new
      *ngIf="showShelfItemNew"
      [(visible)]="showShelfItemNew"
      [itemsData]="itemsData"
      [categoriesData]="categoriesData"
      (onSaved)="savedShelfItems($event)"
    >
    </app-shelf-new>

    <app-shelf-edit
      *ngIf="showShelfItemEdit"
      [(visible)]="showShelfItemEdit"
      [shelfItem]="shelfItemEdit"
      [itemsData]="itemsData"
      [categoriesData]="categoriesData"
      (onEdited)="editedShelfItem($event)"
      (onDeleted)="deletedShelfItem($event)"
    >
    </app-shelf-edit>
  `,
})
export class ShelfComponent implements OnInit {
  shelfItemsData: ShelfItemsData = new ShelfItemsData();
  categoriesData: CategoriesData = new CategoriesData();
  itemsData: ItemsData = new ItemsData();
  shelfData: ShelfData = new ShelfData();
  dataStateHandler: DataStateHandler = new DataStateHandler();

  showShelfItemNew = false;
  //shelfItemNew: ShelfItem = ShelfItem.new();

  showShelfItemEdit = false;
  shelfItemEdit: ShelfItem;

  showCategoryFilter = false;

  constructor(
    public apiService: ApiService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initLoad();
  }

  initLoad() {
    forkJoin({
      shelfItems: this.getShelfItems(),
      categories: this.getCategories(),
      items: this.getItems(),
      shelf: this.getShelf(),
    }).subscribe({
      next: (results) => {
        this.toastService.handleResults(results);
      },
    });
  }

  getShelf() {
    return this.apiService.fetchData(
      this.shelfData,
      this.dataStateHandler,
      () => this.apiService.getShelf()
    );
  }

  getShelfItems() {
    return this.apiService.fetchData(
      this.shelfItemsData,
      this.dataStateHandler,
      () => this.apiService.getShelfItems()
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
    this.shelfItemsData.searchText = searchText;
    this.shelfItemsData.filter();
  }

  onNew() {
    this.showShelfItemNew = true;
  }

  onEdit(shelfItem: ShelfItem) {
    this.shelfItemEdit = shelfItem.deepcopy();
    this.showShelfItemEdit = true;
  }

  onApplyCategoryFilter(categories: Category[]) {
    this.shelfItemsData.selectedCategories = [...categories];
    this.shelfItemsData.filter();
    this.showCategoryFilter = false;
  }

  // ACTIONS

  gotoCategories() {
    this.router.navigate(['categories']);
  }

  
  editedShelfItem(shelfItem: ShelfItem) {
    this.shelfItemsData.update([shelfItem]);
  }

  savedShelfItems(shelfItems: ShelfItem[]) {
    this.shelfItemsData.update(shelfItems);
  }

  deletedShelfItem(shelfItem: ShelfItem) {
    this.shelfItemsData.delete([shelfItem]);
  }
}
