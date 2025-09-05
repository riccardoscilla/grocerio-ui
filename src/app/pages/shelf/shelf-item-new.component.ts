import { Component, computed, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { ShelfItem } from '../../model/shelfItem';
import { Item } from '../../model/item';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-shelf-new',
  template: `
    <app-bottom-sheet
      [visible]="visible"
      header="Add Shelf Item"
      (closed)="onClosed.emit()"
    >
      <app-container content>
        <p-iconField #fullflex iconPosition="right">
          <p-inputIcon styleClass="pi pi-search" />
          <input type="text" pInputText placeholder="Search" [ngModel]="searchItemName()" (ngModelChange)="searchItemName.set($event)" />
        </p-iconField>

        <app-list>
          @for (item of filteredItems(); track item.id) {
            <app-list-tile>
              <app-category-icon leading [icon]="item.icon" [favourite]="item.favourite" />
              <div content>{{item.name}}</div>
              <p-checkbox trailing [(ngModel)]="item.checked" (onChange)="onCheck(item, $event)" [binary]="true"/>
            </app-list-tile>
          }
        </app-list>

        <app-row *ngIf="searchItemName() && sharedDataService.itemsData.isEmpty()">
          <app-button #fullflex [label]="'Add Item '+formattedSearchItemName()" iconLeft="plus.svg"  (onClick)="onOpenNewItem()" />
        </app-row>
      </app-container>

      <app-row footer>
        <app-button #fullflex label="Save" (onClick)="save()" [disabled]="disabledSave()" />
      </app-row>
    </app-bottom-sheet>

    <app-item-new
      *ngIf="showItemNew"
      [item]="itemNew"
      (onClosed)="showItemNew = false"
    ></app-item-new>
  `
})
export class ShelfNewComponent implements OnInit {  
  @Output() onClosed = new EventEmitter<void>();

  visible = false;

  // FORM
  searchItemName = signal('');
  filteredItems = computed(() =>
    this.sharedDataService.itemsData.filter(this.searchItemName())
  );
  itemsToAdd: Item[] = [];

  showItemNew: boolean = false;
  itemNew: Item;

  constructor(
    public sharedDataService: SharedDataService,
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.visible = true;
  }

  formattedSearchItemName() {
    return this.searchItemName().charAt(0).toUpperCase() + this.searchItemName().slice(1).toLowerCase();
  }

  // ACTIONS

  onOpenNewItem() {
    this.itemNew = Item.new();
    this.itemNew.name = this.formattedSearchItemName();
    this.showItemNew = true;
  }

  onCheck(item: Item, check: CheckboxChangeEvent) {
    if (check.checked === true)
      this.itemsToAdd.push(item);
    else 
      this.itemsToAdd = this.itemsToAdd.filter(i => i.id != item.id);
  }

  disabledSave() {
    if (this.itemsToAdd.length === 0) return true;
    return false;
  }

  savedItem(item: Item) {
    this.sharedDataService.itemsData.update([item]);
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
        this.sharedDataService.shelfItemsData.update(shelfItems);
        this.onClosed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error save Shelf Item');
      },
    });
  }
}
