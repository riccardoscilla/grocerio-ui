import { Component, computed, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GroceryItem } from '../../model/groceryItem';
import { Item } from '../../model/item';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-grocery-edit',
  template: `
    <app-bottom-sheet
      [visible]="visible"
      header="Edit Grocery Item"
      (closed)="onClosed.emit()"
    >
      <app-container content>
        <app-row label="Item">
          <app-category-icon [icon]="selectedItem.icon" />
          <app-autocomplete-dropdown #fullflex 
            [(selectedOption)]="selectedItem"
            [options]="filteredItems()" 
            (addNew)="onOpenItemNew($event)"
            valueKey="id"
            labelKey="name"
          > 
            <ng-template #optionTemplate let-item>
              <div>{{ item.icon }} {{ item.name }} </div>
            </ng-template>
          </app-autocomplete-dropdown>
        </app-row>

        <app-row label="Quantity">
          <p-inputGroup #fullflex>
            <button type="button" pButton icon="pi pi-minus" (click)="groceryItem.minusQuantity()"></button>
            <input type="text" pInputText [(ngModel)]="quantity" [readOnly]="true"/>
            <button type="button" pButton icon="pi pi-plus" (click)="groceryItem.plusQuantity()"></button>
          </p-inputGroup>
        </app-row>

        <app-row label="Insertion Date">
          <p-calendar #fullflex [(ngModel)]="insertionDate" [iconDisplay]="'input'" [showIcon]="true" [showButtonBar]="true" [touchUI]="true" dateFormat="dd/mm/yy"/>
        </app-row>

        <app-row label="Note">
          <textarea #fullflex [(ngModel)]="note" rows="2" cols="10" pInputTextarea [autoResize]="true">
          </textarea>
        </app-row>
      </app-container>

      <app-row footer>
        <app-button #fullflex label="Delete" variant="outlined" type="error" (onClick)="onOpenDelete()" />
        <app-button #fullflex label="Save" (onClick)="edit()" [disabled]="disabledEdit()" />
      </app-row>
    </app-bottom-sheet>

    <app-item-new
      *ngIf="showItemNew"
      [item]="itemNew"
      (onClosed)="showItemNew = false"
      (onSaved)="savedItem($event)"
    ></app-item-new>

    <app-grocery-delete
      *ngIf="showGroceryItemDelete"
      [groceryItem]="groceryItemDelete"
      (onClosed)="showGroceryItemDelete = false"
      (onDeleted)="onClosed.emit()"
    ></app-grocery-delete>
  `
})
export class GroceryEditComponent implements OnInit {
  @Input() groceryItem: GroceryItem;
  @Output() onClosed = new EventEmitter<void>();

  visible = false;

  filteredItems = computed(() =>
    this.sharedDataService.itemsData.filter()
  );

  showItemNew: boolean = false;
  itemNew: Item;  

  showGroceryItemDelete = false;
  groceryItemDelete: GroceryItem;

  // form
  selectedItem: Item;
  quantity?: number;
  insertionDate?: Date;
  note?: string;

  constructor(
    public sharedDataService: SharedDataService,
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.selectedItem = this.sharedDataService.itemsData.getByName(this.groceryItem.name)!;
    this.quantity = this.groceryItem.quantity;
    this.insertionDate = this.groceryItem.insertionDate;
    this.note = this.groceryItem.note;
    this.visible = true;
  }

  // HANDLES
  
  onOpenItemNew(name: string) {
    this.itemNew = Item.new();
    this.itemNew.name = name;
    this.showItemNew = true;
  }

  onOpenDelete() {
    this.groceryItemDelete = this.groceryItem.deepcopy();
    this.showGroceryItemDelete = true;
  }

  // ACTIONS

  disabledEdit() {
    if (typeof this.selectedItem === 'string') return true;
    return false;
  }

  savedItem(item: Item) {
    this.sharedDataService.itemsData.update([item]);
    this.selectedItem = item.deepcopy();
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
        this.sharedDataService.groceryItemsData.update([groceryItem]);
        this.onClosed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error edit Shelf Item');
      },
    });
  }
}
