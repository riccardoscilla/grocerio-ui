import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from '../../model/item';
import { Category } from '../../model/category';
import { CategoriesData } from '../../data/data';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-item-edit',
  template: `
    <app-bottom-sheet
      *ngIf="visible"
      [header]="'Edit Item'"
      (closed)="closed()"
    >
      <app-container content>
        <app-row label="Name">
          <input #fullflex type="text" pInputText [(ngModel)]="name" />
        </app-row>

        <app-row label="Category">
          <p-dropdown
            #fullflex
            [options]="categoriesData.filteredCategories"
            [(ngModel)]="category"
            optionLabel="name"
            placeholder="Select a Category"
          >
            <ng-template let-category pTemplate="selectedItem">
              <div>{{ category.icon }} {{ category.name }}</div>
            </ng-template>
            <ng-template let-category pTemplate="item">
              <div>{{ category.icon }} {{ category.name }}</div>
            </ng-template>
          </p-dropdown>
        </app-row>

        <app-row>
          <p-checkbox
            [(ngModel)]="item.favourite"
            [binary]="true"
            variant="filled"
          />
          Favourite
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
          [disabled]="invaliEdit()"
          (click)="save()"
        />
      </app-row>
    </app-bottom-sheet>

    <app-item-delete
      *ngIf="showItemDelete"
      [(visible)]="showItemDelete"
      [item]="itemDelete"
      (onDeleted)="deletedItem($event)"
    ></app-item-delete>
  `
})
export class ItemEditComponent implements OnInit {
  @Input() item: Item;
  @Input() categoriesData: CategoriesData;

  @Output() onClosed = new EventEmitter<void>();
  @Output() onEdited = new EventEmitter<Item>();
  @Output() onDeleted = new EventEmitter<Item>();

  visible = true;
  
  showItemDelete = false;
  itemDelete: Item;

  // form
  name: string;
  category: Category;
  favourite: boolean = false;

  constructor(
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.name = this.item.name;
    this.category = this.item.category;
    this.favourite = this.item.favourite;
  }

  onDelete() {
    this.itemDelete = this.item.deepcopy();
    this.showItemDelete = true;
  }

  save() {
    const data = {
      id: this.item.id,
      name: this.name,
      categoryId: this.category.id,
      favourite: this.favourite,
      lastPurchaseDate: null,
    };

    this.apiService.editItem(this.item.id, data).subscribe({
      next: (item: Item) => {
        this.toastService.handleSuccess('Item saved');
        this.onEdited.emit(item);
        this.onClosed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error save Item');
      },
    });
  }

  deletedItem(item: Item) {
    this.onDeleted.emit(item);
    this.onClosed.emit();
  }

  invaliEdit() {
    if (this.name === undefined || this.name.trim() === '') return true;
    if (this.category === undefined) return true;
    return false;
  }

  closed() {
    this.visible = false;
    this.onClosed.emit();
  }
}
