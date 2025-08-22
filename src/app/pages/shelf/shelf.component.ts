import { Component, OnInit } from '@angular/core';
import { ShelfItem } from '../../model/shelfItem';
import { ToastService } from '../../services/toast.service';
import { CategoriesData, ItemsData, ShelfData, ShelfItemsData } from '../../data/data';
import { DataStateHandler } from '../../data/dataStateHandler';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Category } from '../../model/category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shelf',
  template: `
    <app-scaffold (onRefresh)="initLoad()">
      <app-round-top-container appbar>
        <app-title [title]="shelfData.shelf?.name" [defaultTitle]="'Shelf'" [onPrimary]="true"/> v1.3.9
      </app-round-top-container>
      
      <app-container content [padding]="'16px'" *ngIf="dataStateHandler.isSuccess()">
        <app-list>
          <app-list-tile *ngFor="let shelfItem of shelfItemsData.filteredShelfItems" (onClick)="onEdit(shelfItem)">
            <app-category-icon leading [icon]="shelfItem.icon" [favourite]="shelfItem.item.favourite" />
            <div content>{{shelfItem.name}}</div>
            <div subcontent>{{shelfItem.purchaseDate | date:'EEEE, dd MMMM yyyy'}}</div>
            <div trailing>{{shelfItem.quantity}}</div>
          </app-list-tile>
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

      <app-list-loading content *ngIf="dataStateHandler.isLoading()"></app-list-loading>

      <app-new-button fab (toggleShowNew)="onNew()"></app-new-button>

      <app-menu-bottom bottomtabbar />
    </app-scaffold>
  
    <app-shelf-new
      *ngIf="showShelfItemNew"
      [itemsData]="itemsData"
      [categoriesData]="categoriesData"
      (onClosed)="showShelfItemNew = false"
      (onSaved)="savedShelfItems($event)"
    />

    <app-shelf-edit
      *ngIf="showShelfItemEdit"
      [shelfItem]="shelfItemEdit"
      [itemsData]="itemsData"
      [categoriesData]="categoriesData"
      (onClosed)="showShelfItemEdit = false"
      (onEdited)="editedShelfItem($event)"
      (onDeleted)="deletedShelfItem($event)"
    />
  `
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
