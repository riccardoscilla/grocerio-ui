import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../model/category';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-category-edit',
  template: `
    <app-bottom-sheet
      [header]="'Edit Category'"
      [visible]="visible"
      (visibleChange)="visibleChange.emit($event)"
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
          [disabled]="disabledSave()"
          (click)="save()"
        />
      </app-row>
    </app-bottom-sheet>

    <app-category-delete
      *ngIf="showCategoryDelete"
      [(visible)]="showCategoryDelete"
      [category]="categoryDelete"
      (onDeleted)="deletedCategory($event)"
    ></app-category-delete>
  `,
  styles: [],
})
export class CategoryEditComponent implements OnInit {
  @Input() category: Category;
  @Input() visible: boolean;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onEdited = new EventEmitter<Category>();
  @Output() onDeleted = new EventEmitter<Category>();

  showCategoryDelete = false;
  categoryDelete: Category;

  // form
  name: string;
  icon: string;

  constructor(
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.name = this.category.name;
    this.icon = this.category.icon;
  }

  onDelete() {
    this.categoryDelete = this.category.deepcopy();
    this.showCategoryDelete = true;
  }

  save() {
    const data = {
      id: this.category.id,
      name: this.name,
      icon: this.icon,
    };

    this.apiService.editCategory(this.category.id, data).subscribe({
      next: (category: Category) => {
        this.toastService.handleSuccess('Category saved');
        this.visibleChange.emit(false);
        this.onEdited.emit(category);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error save Category');
      },
    });
  }

  deletedCategory(category: Category) {
    this.onDeleted.emit(category);
    this.visibleChange.emit(false);
  }

  disabledSave() {
    if (this.name === undefined || this.name.trim() === '') return true;
    if (this.icon === undefined || this.name.trim() === '') return true;
    return false;
  }
}
