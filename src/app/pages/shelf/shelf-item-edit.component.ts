import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShelfItem } from '../../model/shelfItem';
import { Item } from '../../model/item';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoriesData, ItemsData } from '../../data/data';

@Component({
  selector: 'app-shelf-edit',
  template: `
    <app-bottom-sheet
      *ngIf="visible"
      [header]="'Edit Shelf Item'"
      (closed)="closed()"
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
              (click)="shelfItem.minusQuantity()"
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
              (click)="shelfItem.plusQuantity()"
            ></button>
          </p-inputGroup>
        </app-row>

        <app-row label="Purchase Date">
          <p-calendar
            #fullflex
            [(ngModel)]="purchaseDate"
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
      [item]="itemNew"
      [categoriesData]="categoriesData"
      (onClosed)="showItemNew = false"
      (onSaved)="savedItem($event)"
    ></app-item-new>

    <app-shelf-delete
      *ngIf="showShelfItemDelete"
      [shelfItem]="shelfItemDelete"
      (onClosed)="showShelfItemDelete = false"
      (onDeleted)="deletedShelfItem($event)"
    ></app-shelf-delete>
  `,
  styles: [],
})
export class ShelfEditComponent implements OnInit {
  @Input() shelfItem: ShelfItem;
  @Input() itemsData: ItemsData;
  @Input() categoriesData: CategoriesData;
  
  @Output() onClosed = new EventEmitter<void>();
  @Output() onEdited = new EventEmitter<ShelfItem>();
  @Output() onDeleted = new EventEmitter<ShelfItem>();

  visible = true;

  showItemNew: boolean = false;
  itemNew: Item;

  showShelfItemDelete = false;
  shelfItemDelete: ShelfItem;

  // form
  selectedItem: Item | string;
  quantity?: number;
  purchaseDate?: Date;
  note?: string;

  constructor(
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.selectedItem = this.itemsData.getByName(this.shelfItem.name)!;
    this.quantity = this.shelfItem.quantity;
    this.purchaseDate = this.shelfItem.purchaseDate;
    this.note = this.shelfItem.note;
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

  closed() {
    this.visible = false;
    this.onClosed.emit();
  }

  onDelete() {
    this.shelfItemDelete = this.shelfItem.deepcopy();
    this.showShelfItemDelete = true;
  }

  // ACTIONS

  invalidEdit() {
    if (typeof this.selectedItem === 'string') return true;
    return false;
  }

  savedItem(item: Item) {
    this.itemsData.update([item]);
    this.selectedItem = item.deepcopy();
  }

  edit() {
    if (typeof this.selectedItem === 'string') return;

    const data = {
      id: this.shelfItem.id,
      itemId: this.selectedItem.id,
      quantity: this.quantity,
      purchaseDate: this.purchaseDate,
      note: this.note,
    };

    this.apiService.editShelfItem(this.shelfItem.id, data).subscribe({
      next: (shelfItem: ShelfItem) => {
        this.toastService.handleSuccess('Shelf Item saved');
        // this.visibleChange.emit(false);
        this.onEdited.emit(shelfItem);
        this.onClosed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error edit Shelf Item');
      },
    });
  }

  deletedShelfItem(shelfItem: ShelfItem) {
    // this.visibleChange.emit(false);
    this.onDeleted.emit(shelfItem); 
    this.onClosed.emit();
  }
}
