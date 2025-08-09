import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShelfItem } from '../../model/shelfItem';
import { Item } from '../../model/item';
import { CategoriesData, ItemsData } from '../../data/data';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-shelf-new',
  template: `
    <app-bottom-sheet
      [header]="'Add Shelf Item'"
      [visible]="visible"
      (visibleChange)="visibleChange.emit($event)"
    >
      <app-container content>
        <p-iconField #fullflex iconPosition="right">
          <p-inputIcon styleClass="pi pi-search" />
          <input type="text" pInputText placeholder="Search" [(ngModel)]="searchText" (ngModelChange)="onSearch(searchText)" />
        </p-iconField>

        <!-- <app-row>
          <app-chip [label]="'All'" />
        </app-row> -->

        <app-list>
          <app-list-item
            *ngFor="let item of itemsData.filteredItems"
            [icon]="item.icon"
            [favourite]="item.favourite"
            [contentText]="item.name"
            [showCheckbox]="true"
            [checked]="inItemsToAdd(item)"
            (check)="onCheck(item, $event)"
          >
          </app-list-item>
        </app-list>

        <app-row *ngIf="searchText && itemsData.isEmpty()">
          <p-button #fullflex [label]="'Add Item '+formattedSearchText()" icon="pi pi-plus" [outlined]="true" (click)="onNewItem()" />
        </app-row>
      </app-container>


      <!-- <app-container content>
        <app-row label="Item">
          <app-item-autocomplete-dropdown
            #fullflex
            [itemsData]="itemsData"
            [(selectedItem)]="selectedItem"
          >
          </app-item-autocomplete-dropdown>

          <p-button
            icon="pi pi-plus"
            *ngIf="showAddNewItem()"
            (click)="onNewItem()"
          />
        </app-row>

        <app-row>
          <p-button
            #fullflex
            label="Add in shelf"
            [outlined]="true"
            (click)="onAddInShelf()"
            [disabled]="disabledAddInShelf()"
          />
        </app-row>

        <app-row *ngIf="itemsToAdd.length !== 0">
          Items to insert in shelf
        </app-row>
        <app-list *ngIf="itemsToAdd.length !== 0">
          <app-list-item
            *ngFor="let item of itemsToAdd"
            [icon]="item.icon"
            [contentText]="item.name"
            [deleteButton]="true"
            (delete)="onRemoveFromShelf(item.id)"
          />
        </app-list>
      </app-container> -->

      <app-row footer>
        <p-button #fullflex label="Save" (click)="save()" [disabled]="disabledSave()"/>
      </app-row>
    </app-bottom-sheet>

    <app-item-new
      *ngIf="showItemNew"
      [(visible)]="showItemNew"
      [item]="itemNew"
      [categoriesData]="categoriesData"
      (onSaved)="savedItem($event)"
    ></app-item-new>
  `
})
export class ShelfNewComponent implements OnInit {
  @Input() itemsData: ItemsData;
  @Input() categoriesData: CategoriesData;
  @Input() visible: boolean;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSaved = new EventEmitter<ShelfItem[]>();

  // FORM
  searchText: string

  selectedItem: Item | string;
  itemsToAdd: Item[] = [];

  showItemNew: boolean = false;
  itemNew: Item;

  constructor(
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.selectedItem = '';
  }

  // HANDLES

  inItemsToAdd(item: Item) {
    return this.itemsToAdd.filter(i => i.id == item.id).length > 0
  }

  formattedSearchText() {
    return this.searchText.charAt(0).toUpperCase() + this.searchText.slice(1).toLowerCase();
  }

  // ACTIONS

  onSearch(searchText: string) {
    this.itemsData.filter(searchText);
  }

  onNewItem() {
    this.itemNew = Item.new();
    this.itemNew.name = this.formattedSearchText();
    this.showItemNew = true;
  }

  onCheck(item: Item, check: boolean) {
    if (check)
      this.itemsToAdd.push(item);
    else 
      this.itemsToAdd = this.itemsToAdd.filter(i => i.id != item.id);
  }

  disabledAddInShelf() {
    if (typeof this.selectedItem === 'string') return true;
    return false;
  }

  disabledSave() {
    if (this.itemsToAdd.length === 0) return true;
    return false;
  }

  savedItem(item: Item) {
    this.itemsData.update([item]);
    this.selectedItem = item.deepcopy();
  }

  save() {
    const data = this.itemsToAdd.map((item) => {
      return {
        itemId: item.id,
        quantity: 1,
        purchaseDate: new Date(),
        note: undefined,
      };
    });

    this.apiService.saveShelfItems(data).subscribe({
      next: (shelfItems: ShelfItem[]) => {
        this.toastService.handleSuccess('Shelf Item saved');
        this.visibleChange.emit(false);
        this.onSaved.emit(shelfItems);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error save Shelf Item');
      },
    });
  }
}
