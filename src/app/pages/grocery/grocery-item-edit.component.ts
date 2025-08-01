import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GroceryItem } from '../../model/groceryItem';
import { Item } from '../../model/item';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoriesData, ItemsData } from '../../data/data';

@Component({
  selector: 'app-grocery-edit',
  template: `
    <app-bottom-sheet
      [header]="'Edit Grocery Item'"
      [visible]="visible"
      (visibleChange)="visibleChange.emit($event)"
    >
      <app-container content>
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

        <app-row label="Quantity">
          <p-inputGroup #fullflex>
            <button
              type="button"
              pButton
              icon="pi pi-minus"
              (click)="groceryItem.minusQuantity()"
            ></button>
            <input
              type="text"
              pInputText
              [(ngModel)]="quantity"
              [readOnly]="true"
            />
            <button
              type="button"
              pButton
              icon="pi pi-plus"
              (click)="groceryItem.plusQuantity()"
            ></button>
          </p-inputGroup>
        </app-row>

        <app-row label="Insertion Date">
          <p-calendar
            #fullflex
            [(ngModel)]="insertionDate"
            [iconDisplay]="'input'"
            [showIcon]="true"
            [showButtonBar]="true"
            [touchUI]="true"
            dateFormat="dd/mm/yy"
          />
        </app-row>

        <app-row label="Note">
          <textarea
            #fullflex
            [(ngModel)]="note"
            rows="2"
            cols="10"
            pInputTextarea
            [autoResize]="true"
          >
          </textarea>
        </app-row>
      </app-container>

      <app-row footer>
        <p-button
          #fullflex
          label="Delete"
          [outlined]="true"
          (click)="onDelete()"
          severity="danger"
        />
        <p-button
          #fullflex
          label="Save"
          (click)="edit()"
          [disabled]="invalidEdit()"
        />
      </app-row>
    </app-bottom-sheet>

    <app-item-new
      *ngIf="showItemNew"
      [(visible)]="showItemNew"
      [item]="itemNew"
      [categoriesData]="categoriesData"
      (onSaved)="savedItem($event)"
    ></app-item-new>

    <app-grocery-delete
      *ngIf="showGroceryItemDelete"
      [(visible)]="showGroceryItemDelete"
      [groceryItem]="groceryItemDelete"
      (onDeleted)="deletedGroceryItem($event)"
    ></app-grocery-delete>
  `
})
export class GroceryEditComponent implements OnInit {
  @Input() groceryItem: GroceryItem;
  @Input() itemsData: ItemsData;
  @Input() categoriesData: CategoriesData;
  @Input() visible: boolean;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onEdited = new EventEmitter<GroceryItem>();
  @Output() onDeleted = new EventEmitter<GroceryItem>();

  showItemNew: boolean = false;
  itemNew: Item;  

  showGroceryItemDelete = false;
  groceryItemDelete: GroceryItem;

  // form
  selectedItem: Item | string;
  quantity?: number;
  insertionDate?: Date;
  note?: string;

  constructor(
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.selectedItem = this.itemsData.getByName(this.groceryItem.name)!;
    this.quantity = this.groceryItem.quantity;
    this.insertionDate = this.groceryItem.insertionDate;
    this.note = this.groceryItem.note;
  }

  // HANDLES

  showAddNewItem() {
    if (this.itemsData.isEmpty()) return true;

    const name =
      typeof this.selectedItem === 'string'
        ? this.selectedItem
        : this.selectedItem.name;

    if (name.trim().length === 0) return false;

    if (this.itemsData.existByName(name)) return false;

    return true;
  }

  onNewItem() {
    const name =
      typeof this.selectedItem === 'string'
        ? this.selectedItem
        : this.selectedItem.name;

    this.itemNew = Item.new();
    this.itemNew.name = name;
    this.showItemNew = true;
  }

  onDelete() {
    this.groceryItemDelete = this.groceryItem.deepcopy();
    this.showGroceryItemDelete = true;
  }

  // ACTIONS

  invalidEdit() {
    if (typeof this.selectedItem === 'string') return true;
    return false;
  }

  savedItem(item: Item) {
    this.itemsData.update([item]);
    this.selectedItem = item.deepcopy();
    // this.itemName = item.name
  }

  edit() {
    if (typeof this.selectedItem === 'string') return;

    const data = {
      id: this.groceryItem.id,
      itemId: this.selectedItem.id,
      quantity: this.quantity,
      insertionDate: this.insertionDate,
      note: this.note,
      inCart: this.groceryItem.inCart,
    };

    this.apiService.editGroceryItem(this.groceryItem.id, data).subscribe({
      next: (groceryItem: GroceryItem) => {
        this.toastService.handleSuccess('Shelf Item saved');
        this.visibleChange.emit(false);
        this.onEdited.emit(groceryItem);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error edit Shelf Item');
      },
    });
  }

  deletedGroceryItem(groceryItem: GroceryItem) {
    this.onDeleted.emit(groceryItem);
    this.visibleChange.emit(false);
  }

}
