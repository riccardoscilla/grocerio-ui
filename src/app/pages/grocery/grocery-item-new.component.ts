import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from '../../model/item';
import { GroceryItem } from '../../model/groceryItem';
import { CategoriesData, ItemsData } from '../../data/data';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CheckboxChangeEvent } from 'primeng/checkbox';

@Component({
  selector: 'app-grocery-new',
  template: `
    <app-bottom-sheet
      *ngIf="visible"
      [header]="'Add Grocery Item'"
      (closed)="closed()"
    >
      <app-container content>
        <p-iconField #fullflex iconPosition="right">
          <p-inputIcon styleClass="pi pi-search" />
          <input type="text" pInputText placeholder="Search" [(ngModel)]="searchText" (ngModelChange)="onSearch(searchText)" />
        </p-iconField>

        <!-- <app-row>
          <app-chip [label]="'All'" [selected]="true" />
          <app-chip [label]="'Not in Shelf'" />
        </app-row> -->

        <app-list>
          @for (item of itemsData.filteredItems; track item.id) {
            <app-list-tile>
              <app-category-icon leading [icon]="item.icon" [favourite]="item.favourite" />
              <div content>{{item.name}}</div>
              <p-checkbox trailing [(ngModel)]="item.checked" (onChange)="onCheck(item, $event)" [binary]="true"/>
            </app-list-tile>
          }
        </app-list>

        <app-row *ngIf="searchText && itemsData.isEmpty()">
          <p-button #fullflex [label]="'Add Item '+formattedSearchText()" icon="pi pi-plus" [outlined]="true" (click)="onNewItem()" />
        </app-row>
      </app-container>

      <app-row footer>
        <p-button
          #fullflex
          label="Save"
          (click)="save()"
          [disabled]="disabledSave()"
        />
      </app-row>

    </app-bottom-sheet>

    <app-item-new
      *ngIf="showItemNew"
      [item]="itemNew"
      [categoriesData]="categoriesData"
      (onClosed)="showItemNew = false"
      (onSaved)="savedItem($event)"
    ></app-item-new>
  `,
  styles: [],
})
export class GroceryNewComponent implements OnInit {
  @Input() itemsData: ItemsData;
  @Input() categoriesData: CategoriesData;

  @Output() onClosed = new EventEmitter<void>();
  @Output() onSaved = new EventEmitter<GroceryItem[]>();

  visible = true;

  // FORM
  searchText: string;
  itemsToAdd: Item[] = [];

  showItemNew: boolean = false;
  itemNew: Item;

  constructor(
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.itemsData.items.forEach(i => i.checked = false);
    this.itemsData.filter();
  }

  formattedSearchText() {
    return this.searchText.charAt(0).toUpperCase() + this.searchText.slice(1).toLowerCase();
  }

  onNewItem() {
    this.itemNew = Item.new();
    this.itemNew.name = this.formattedSearchText();
    this.showItemNew = true;
  }

  onCheck(item: Item, check: CheckboxChangeEvent) {
    if (check.checked === true)
      this.itemsToAdd.push(item);
    else 
      this.itemsToAdd = this.itemsToAdd.filter(i => i.id != item.id);
  }

  // ACTIONS

  onSearch(searchText: string) {
    this.itemsData.filter(searchText);
  }

  disabledSave() {
    if (this.itemsToAdd.length === 0) return true;
    return false;
  }

  savedItem(item: Item) {
    this.itemsData.update([item]);
  }

  save() {
    const data = this.itemsToAdd.map((item) => {
      return {
        itemId: item.id,
        quantity: 1,
        insertionDate: new Date(),
        note: undefined,
        inCart: false,
      };
    });

    this.apiService.saveGroceryItems(data).subscribe({
      next: (groceryItems: GroceryItem[]) => {
        this.toastService.handleSuccess('Grocery Item saved');
        this.onSaved.emit(groceryItems);
        this.onClosed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error save Grocery Item');
      },
    });
  }

  closed() {
    this.visible = false;
    this.onClosed.emit();
  }
}
