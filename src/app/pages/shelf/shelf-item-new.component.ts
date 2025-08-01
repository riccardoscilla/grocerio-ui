import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class ShelfNewComponent implements OnInit {
  @Input() itemsData: ItemsData;
  @Input() categoriesData: CategoriesData;
  @Input() visible: boolean;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSaved = new EventEmitter<ShelfItem[]>();

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

  onAddInShelf() {
    if (typeof this.selectedItem === 'string') return;

    const data = {
      id: this.selectedItem.id,
      name: this.selectedItem.name,
      icon: this.selectedItem.icon,
    };
    this.itemsToAdd.push(data);
    this.selectedItem = '';
  }

  onRemoveFromShelf(id: string) {
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
