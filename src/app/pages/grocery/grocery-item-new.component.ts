import { Component, computed, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { Item } from '../../model/item';
import { GroceryItem } from '../../model/groceryItem';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-grocery-new',
  template: `
    <app-bottom-sheet
      [visible]="visible"
      header="Add Grocery Item"
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
  `,
  styles: [],
})
export class GroceryNewComponent implements OnInit {
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
    this.sharedDataService.itemsData.getData().forEach(i => i.checked = false);
    this.visible = true;
  }

  formattedSearchItemName() {
    return this.searchItemName().charAt(0).toUpperCase() + this.searchItemName().slice(1).toLowerCase();
  }

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

  // ACTIONS

  disabledSave() {
    if (this.itemsToAdd.length === 0) return true;
    return false;
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
        this.sharedDataService.groceryItemsData.update(groceryItems);
        this.onClosed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error save Grocery Item');
      },
    });
  }
}
