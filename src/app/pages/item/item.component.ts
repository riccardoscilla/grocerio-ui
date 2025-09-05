import { Component, computed, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { DataStateHandler } from '../../data/dataStateHandler';
import { Item } from '../../model/item';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-item',
  template: `
    <app-scaffold (onRefresh)="initLoad()">
      <app-title appbar [title]="'Items'" [back]="'/more'"/>

      <app-container content [padding]="'16px'" *ngIf="dataStateHandler.isSuccess()">
        <app-list>
          @for (item of filteredItems(); track item.id) {
            <app-list-tile (onClick)="onOpenEdit(item)">
              <app-category-icon leading [icon]="item.icon" [favourite]="item.favourite" />
            <div content>{{item.name}}</div>
            </app-list-tile>
          }
        </app-list>

        <app-row *ngIf="sharedDataService.itemsData.isEmpty()">No Items</app-row>
      </app-container>

      <app-list-loading content *ngIf="dataStateHandler.isLoading()"></app-list-loading>

      <app-button fab icon="plus.svg" shape="round" size="large" iconSize="20" (onClick)="onOpenNew()"/>

      <app-menu-bottom bottomtabbar />
    </app-scaffold>

    <app-item-new
      *ngIf="showItemNew"
      [item]="itemNew"
      (onClosed)="showItemNew = false"
    />

    <app-item-edit
      *ngIf="showItemEdit"
      [item]="itemEdit"
      (onClosed)="showItemEdit = false"
    />
  `,
})
export class ItemComponent implements OnInit {
  dataStateHandler: DataStateHandler = new DataStateHandler();

  showItemNew = false;
  itemNew: Item;

  showItemEdit = false;
  itemEdit: Item;

  filteredItems = computed(() =>
    this.sharedDataService.itemsData.filter()
  );

  constructor(
    public sharedDataService: SharedDataService,
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
    this.itemNew = Item.new();
    this.showItemNew = true;
  }

  onOpenEdit(item: Item) {
    this.itemEdit = item.deepcopy();
    this.showItemEdit = true;
  }
}
