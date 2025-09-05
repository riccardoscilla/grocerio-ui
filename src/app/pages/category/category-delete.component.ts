import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Category } from '../../model/category';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-category-delete',
  template: `
   <app-bottom-sheet
      [visible]="visible"
      header="Delete Category"
      (closed)="onClosed.emit()"
    >
      <app-container content>
        Delete category {{ category.icon }} {{ category.name }}?
      </app-container>

      <app-container footer>
        <app-row>
          <app-button #fullflex label="Delete" type="error" (onClick)="delete()" />
        </app-row>
      </app-container>
      
    </app-bottom-sheet>
  `,
  styles: [],
})
export class CategoryDeleteComponent implements OnInit {
  @Input() category: Category;
  @Output() onClosed = new EventEmitter<void>();
  @Output() onDeleted = new EventEmitter<void>();

  visible = false;

  constructor(
    public sharedDataService: SharedDataService,
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.visible = true;
  }

  delete() {
    this.apiService.deleteCategory(this.category.id).subscribe({
      next: (category: Category) => {
        this.toastService.handleSuccess('Category deleted');
        this.sharedDataService.categoriesData.delete([category])
        this.onDeleted.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error delete Category');
      },
    });
  }
}
