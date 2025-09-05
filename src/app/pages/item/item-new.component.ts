import { Component, computed, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from '../../model/item';
import { Category } from '../../model/category';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-item-new',
  template: `
    <app-bottom-sheet
      [visible]="visible"
      header="New Item"
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
        <app-button #fullflex label="Save" (onClick)="save()" [disabled]="disabledSave()" />
      </app-row>
    </app-bottom-sheet>
  `,
  styles: [],
})
export class ItemNewComponent implements OnInit {
  @Input() item: Item;
  @Output() onClosed = new EventEmitter<void>();
  @Output() onSaved = new EventEmitter<Item>();

  visible = false;

  filteredCategories = computed(() =>
    this.sharedDataService.categoriesData.filter()
  );

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
    this.visible = true;
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
        this.sharedDataService.itemsData.update([item]);
        this.onSaved.emit(item);
        this.onClosed.emit();
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
