import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShelfItem } from '../../model/shelfItem';
import { Item } from '../../model/item';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-shelf-edit',
  template: `
    <app-bottom-sheet
      [visible]="visible"
      header="Edit Shelf Item"
      (closed)="onClosed.emit()"
    >
      <app-container content>
        <app-row label="Item">
          <app-category-icon [icon]="selectedItem?.icon" />
          <app-autocomplete-dropdown #fullflex 
            [(selectedOption)]="selectedItem"
            [options]="sharedDataService.itemsData.filter()" 
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
            <button type="button" pButton icon="pi pi-minus" (click)="shelfItem.minusQuantity()"></button>
            <input type="text" pInputText [(ngModel)]="quantity" [readOnly]="true"/>
            <button type="button" pButton icon="pi pi-plus" (click)="shelfItem.plusQuantity()"></button>
          </p-inputGroup>
        </app-row>

        <app-row label="Purchase Date">
          <p-calendar #fullflex [(ngModel)]="purchaseDate" [iconDisplay]="'input'" [showIcon]="true" [showButtonBar]="true" [touchUI]="true" dateFormat="dd/mm/yy"/>
        </app-row>

        <app-row label="Note">
          <textarea #fullflex [(ngModel)]="note" rows="2" cols="10" pInputTextarea [autoResize]="true"></textarea>
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

    <app-shelf-delete
      *ngIf="showShelfItemDelete"
      [shelfItem]="shelfItemDelete"
      (onClosed)="showShelfItemDelete = false"
      (onDeleted)="onClosed.emit()"
    ></app-shelf-delete>
  `,
  styles: [],
})
export class ShelfEditComponent implements OnInit {
  @Input() shelfItem: ShelfItem;
  @Output() onClosed = new EventEmitter<void>();

  visible = false;

  showItemNew: boolean = false;
  itemNew: Item;

  showShelfItemDelete = false;
  shelfItemDelete: ShelfItem;

  // form
  selectedItem: Item | undefined;
  quantity?: number;
  purchaseDate?: Date;
  note?: string;

  constructor(
    public sharedDataService: SharedDataService,
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.selectedItem = this.sharedDataService.itemsData.getByName(this.shelfItem.name)!;
    this.quantity = this.shelfItem.quantity;
    this.purchaseDate = this.shelfItem.purchaseDate;
    this.note = this.shelfItem.note;
    this.visible = true;
  }

  // HANDLES

  onOpenItemNew(name: string) {
    this.itemNew = Item.new();
    this.itemNew.name = name;
    this.showItemNew = true;
  }

  onOpenDelete() {
    this.shelfItemDelete = this.shelfItem.deepcopy();
    this.showShelfItemDelete = true;
  }

  // ACTIONS

  disabledEdit() {
    if (typeof this.selectedItem === 'string') return true;
    return false;
  }

  savedItem(item: Item) {
    console.log(item)
    this.selectedItem = item;
  }

  edit() {
    if (typeof this.selectedItem === undefined) return;

    const data = {
      id: this.shelfItem.id,
      itemId: this.selectedItem!.id,
      quantity: this.quantity,
      purchaseDate: this.purchaseDate,
      note: this.note,
    };

    this.apiService.editShelfItem(this.shelfItem.id, data).subscribe({
      next: (shelfItem: ShelfItem) => {
        this.toastService.handleSuccess('Shelf Item saved');
        this.sharedDataService.shelfItemsData.update([shelfItem]);
        this.onClosed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error edit Shelf Item');
      },
    });
  }
}
