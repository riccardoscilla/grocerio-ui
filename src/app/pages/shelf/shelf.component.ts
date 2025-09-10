import { Component, computed, OnInit } from '@angular/core';
import { ShelfItem } from '../../model/shelfItem';
import { ToastService } from '../../services/toast.service';
import { DataStateHandler } from '../../data/dataStateHandler';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-shelf',
  template: `
    <app-scaffold (onRefresh)="initLoad()">  
      <app-title appbar [title]="sharedDataService.shelfData.getData()?.name + ' v1.3.4'" defaultTitle="Shelf"/>

      <app-card content>
        <app-container padding="8px 16px" *ngIf="dataStateHandler.isSuccess()">
          <app-list>
            @for (shelfItem of filteredShelfItems(); track shelfItem.id) {
              <app-list-tile (onClick)="onOpenEdit(shelfItem)">
                <app-category-icon leading [icon]="shelfItem.icon" [favourite]="shelfItem.item.favourite" />
                <div content>{{shelfItem.name}}</div>
                <div subcontent>{{shelfItem.purchaseDate | date:'EEEE, dd MMMM yyyy'}}</div>
                <div trailing>{{shelfItem.quantity}}</div>
              </app-list-tile>
            }
          </app-list>

          <app-row *ngIf="sharedDataService.shelfItemsData.isEmpty() && !sharedDataService.categoriesData.isEmpty()">
            No Shelf Items
          </app-row>

          <app-row *ngIf="sharedDataService.categoriesData.isEmpty()">
            <app-button #fullflex label="Start here to add new Categories" (onClick)="gotoCategories()" />
          </app-row>
        </app-container>
      </app-card>

      <app-list-loading content *ngIf="dataStateHandler.isLoading()"></app-list-loading>

      <app-button fab icon="plus.svg" shape="round" size="large" iconSize="20" (onClick)="onOpenNew()"/>

      <app-menu-bottom bottomtabbar />
    </app-scaffold>
  
    <app-shelf-new
      *ngIf="showShelfItemNew"
      (onClosed)="showShelfItemNew = false"
    />

    <app-shelf-edit
      *ngIf="showShelfItemEdit"
      [shelfItem]="shelfItemEdit"
      (onClosed)="showShelfItemEdit = false"
    />
  `
})
export class ShelfComponent implements OnInit {
  dataStateHandler: DataStateHandler = new DataStateHandler();

  showShelfItemNew = false;
  showShelfItemEdit = false;
  shelfItemEdit: ShelfItem;

  filteredShelfItems = computed(() =>
    this.sharedDataService.shelfItemsData.filter()
  );

  constructor(
    public sharedDataService: SharedDataService,
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
      this.sharedDataService.shelfData,
      this.dataStateHandler,
      () => this.apiService.getShelf()
    );
  }

  getShelfItems() {
    return this.apiService.fetchData(
      this.sharedDataService.shelfItemsData,
      this.dataStateHandler,
      () => this.apiService.getShelfItems()
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
    this.showShelfItemNew = true;
  }

  onOpenEdit(shelfItem: ShelfItem) {
    this.shelfItemEdit = shelfItem.deepcopy();
    this.showShelfItemEdit = true;
  }

  // ACTIONS

  gotoCategories() {
    this.router.navigate(['categories']);
  }
}
