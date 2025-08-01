import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from '../../model/item';
import { GroceryItem } from '../../model/groceryItem';
import { CategoriesData, ItemsData } from '../../data/data';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-grocery-new',
  template: `
    <app-bottom-sheet
      [header]="'Add Grocery Item'"
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

        <app-row>
          <p-button
            #fullflex
            label="Add in Grocery List"
            [outlined]="true"
            (click)="onAddInList()"
            [disabled]="disabledAddInShelf()"
          />
        </app-row>

        <app-row *ngIf="itemsToAdd.length !== 0">
          Items to insert in grocery list
        </app-row>
        <app-list *ngIf="itemsToAdd.length !== 0">
          <app-list-item
            *ngFor="let item of itemsToAdd"
            [icon]="item.icon"
            [contentText]="item.name"
            [deleteButton]="true"
            (delete)="onRemoveFromList(item.id)"
          />
        </app-list>
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
      [(visible)]="showItemNew"
      [item]="itemNew"
      [categoriesData]="categoriesData"
      (onSaved)="savedItem($event)"
    ></app-item-new>
  `,
  styles: [],
})
export class GroceryNewComponent implements OnInit {
  @Input() itemsData: ItemsData;
  @Input() categoriesData: CategoriesData;
  @Input() visible: boolean;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSaved = new EventEmitter<GroceryItem[]>();

  // FORM
  selectedItem: Item | string;
  itemsToAdd: any[] = [];

  showItemNew: boolean = false;
  itemNew: Item;

  constructor(
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.selectedItem = '';
  }

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

  onAddInList() {
    if (typeof this.selectedItem === 'string') return;

    const data = {
      id: this.selectedItem.id,
      name: this.selectedItem.name,
      icon: this.selectedItem.icon,
    };
    this.itemsToAdd.push(data);
    this.selectedItem = '';
  }

  onRemoveFromList(id: string) {
    this.itemsToAdd = this.itemsToAdd.filter((item) => item.id !== id);
  }

  // ACTIONS

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
        insertionDate: new Date(),
        note: undefined,
        inCart: false,
      };
    });

    this.apiService.saveGroceryItems(data).subscribe({
      next: (groceryItems: GroceryItem[]) => {
        this.toastService.handleSuccess('List Item saved');
        this.visibleChange.emit(false);
        this.onSaved.emit(groceryItems);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error save List Item');
      },
    });
  }
}
