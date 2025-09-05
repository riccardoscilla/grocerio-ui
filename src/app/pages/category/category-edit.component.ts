import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../model/category';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-category-edit',
  template: `
    <app-bottom-sheet
      [visible]="visible"
      header="Edit Category"
      (closed)="onClosed.emit()"
    >
      <app-container content>
        <app-row label="Name">
          <input #fullflex type="text" pInputText [(ngModel)]="name" />
        </app-row>

        <app-row label="Icon">
          <input #fullflex type="text" pInputText [(ngModel)]="icon" />
        </app-row>
      </app-container>

      <app-row footer>
        <app-button #fullflex label="Delete" variant="outlined" type="error" (onClick)="onOpenDelete()" />
        <app-button #fullflex label="Save" (onClick)="edit()" [disabled]="disabledEdit()" />
      </app-row>
    </app-bottom-sheet>

    <app-category-delete
      *ngIf="showCategoryDelete"
      [category]="categoryDelete"
      (onClosed)="showCategoryDelete = false"
      (onDeleted)="onClosed.emit()"
    ></app-category-delete>
  `,
  styles: [],
})
export class CategoryEditComponent implements OnInit {
  @Input() category: Category;
  @Output() onClosed = new EventEmitter<void>();

  visible = false;

  showCategoryDelete = false;
  categoryDelete: Category;

  // form
  name: string;
  icon: string;

  constructor(
    public sharedDataService: SharedDataService,
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.name = this.category.name;
    this.icon = this.category.icon;

    this.visible = true;
  }

  onOpenDelete() {
    this.categoryDelete = this.category.deepcopy();
    this.showCategoryDelete = true;
  }

  edit() {
    const data = {
      id: this.category.id,
      name: this.name,
      icon: this.icon,
    };

    this.apiService.editCategory(this.category.id, data).subscribe({
      next: (category: Category) => {
        this.toastService.handleSuccess('Category saved');
        this.sharedDataService.categoriesData.update([category]);
        this.onClosed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error save Category');
      },
    });
  }

  disabledEdit() {
    if (this.name === undefined || this.name.trim() === '') return true;
    if (this.icon === undefined || this.name.trim() === '') return true;
    return false;
  }
}
