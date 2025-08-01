import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from '../../model/item';
import { Category } from '../../model/category';
import { CategoriesData } from '../../data/data';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-item-new',
  template: `
    <app-bottom-sheet
      [header]="'New Item'"
      [visible]="visible"
      (visibleChange)="visibleChange.emit($event)"
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
          label="Save"
          [disabled]="disabledSave()"
          (click)="save()"
        />
      </app-row>
    </app-bottom-sheet>
  `,
  styles: [],
})
export class ItemNewComponent implements OnInit {
  @Input() item: Item;
  @Input() categoriesData: CategoriesData;
  @Input() visible: boolean;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSaved = new EventEmitter<Item>();

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
  }

  save() {
    const data = {
      name: this.name,
      categoryId: this.category.id,
      favourite: this.favourite,
      lastPurchaseDate: null,
    };

    this.apiService.saveItem(data).subscribe({
      next: (item: Item) => {
        this.toastService.handleSuccess('Item saved');
        this.visibleChange.emit(false);
        this.onSaved.emit(item);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error save Item');
      },
    });
  }

  disabledSave() {
    if (this.name === undefined || this.name.trim() === '') return true;
    if (this.category === undefined) return true;
    return false;
  }
}
