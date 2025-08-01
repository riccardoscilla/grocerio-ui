import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroceryItem } from '../../model/groceryItem';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Item } from '../../model/item';
import { Category } from '../../model/category';

@Component({
  selector: 'app-category-delete',
  template: `
    <p-dialog
      [(visible)]="visible"
      [draggable]="false"
      [resizable]="false"
      [modal]="true"
      [closable]="true"
      [dismissableMask]="true"
      [header]="'Delete Category'"
      (onHide)="visibleChange.emit(false)"
      position="bottom"
      class="bottom-sheet"
    >
      <app-container>
        Delete Category {{ category.icon }} {{ category.name }}?
      </app-container>

      <ng-template pTemplate="footer">
        <app-row>
          <p-button
            #fullflex
            label="Delete"
            [outlined]="true"
            severity="danger"
            (click)="delete()"
          />
        </app-row>
      </ng-template>
    </p-dialog>
  `,
  styles: [],
})
export class CategoryDeleteComponent {
  @Input() category: Category;
  @Input() visible: boolean;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onDeleted = new EventEmitter<Category>();

  constructor(
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  delete() {
    this.apiService.deleteCategory(this.category.id).subscribe({
      next: (category: Category) => {
        this.toastService.handleSuccess('Category deleted');
        this.onDeleted.emit(category);
        this.visibleChange.emit(false);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error delete Category');
      },
    });
  }
}
