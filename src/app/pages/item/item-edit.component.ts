import { Component, computed, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from '../../model/item';
import { Category } from '../../model/category';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-item-edit',
  template: `
    <app-bottom-sheet
      [visible]="visible"
      header="Edit Item"
      (closed)="onClosed.emit()"
    >
      <app-container content>
        <app-row label="Name">
          <input #fullflex type="text" pInputText [(ngModel)]="name" />
        </app-row>

        <app-row label="Category">
          <app-dropdown #fullflex [(selectedOption)]="category" [options]="filteredCategories()" valueKey="id" labelKey="name">
            <ng-template #selectedOptionTemplate let-category>
              <div>{{ category.icon }} {{ category.name }} </div>
            </ng-template>
            <ng-template #optionTemplate let-category>
              <div>{{ category.icon }} {{ category.name }} </div>
            </ng-template>
          </app-dropdown>
        </app-row>

        <app-row>
          <p-checkbox [(ngModel)]="item.favourite" [binary]="true" variant="filled"/>
          Favourite
        </app-row>
      </app-container>

      <app-row footer>
        <app-button #fullflex label="Delete" variant="outlined" type="error" (onClick)="onOpenDelete()" />
        <app-button #fullflex label="Save" (onClick)="edit()" [disabled]="disabledEdit()" />
      </app-row>
    </app-bottom-sheet>

    <app-item-delete
      *ngIf="showItemDelete"
      [item]="itemDelete"
      (onClosed)="showItemDelete = false"
      (onDeleted)="onClosed.emit()"
    ></app-item-delete>
  `
})
export class ItemEditComponent implements OnInit {
  @Input() item: Item;
  @Output() onClosed = new EventEmitter<void>();

  visible = false;

  filteredCategories = computed(() =>
    this.sharedDataService.categoriesData.filter()
  );
  
  showItemDelete = false;
  itemDelete: Item;

  // form
  name: string;
  category: Category;
  favourite: boolean = false;

  constructor(
    public sharedDataService: SharedDataService,
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.name = this.item.name;
    this.category = this.item.category;
    this.favourite = this.item.favourite;

    this.visible = true;
  }

  onOpenDelete() {
    this.itemDelete = this.item.deepcopy();
    this.showItemDelete = true;
  }

  edit() {
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
        this.sharedDataService.itemsData.update([item]);
        this.onClosed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error save Item');
      },
    });
  }

  disabledEdit() {
    if (this.name === undefined || this.name.trim() === '') return true;
    if (this.category === undefined) return true;
    return false;
  }
}
