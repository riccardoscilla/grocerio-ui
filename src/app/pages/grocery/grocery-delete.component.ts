import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroceryItem } from '../../model/groceryItem';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-grocery-delete',
  template: `
    <p-dialog
      [(visible)]="visible"
      [draggable]="false"
      [resizable]="false"
      [modal]="true"
      [closable]="true"
      [dismissableMask]="true"
      [header]="'Delete Grocery Item'"
      (onHide)="visibleChange.emit(false)"
      position="bottom"
      class="bottom-sheet"
    >
      <app-container>
        Delete grocery item {{ groceryItem.icon }} {{ groceryItem.name }}?
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
export class GroceryDeleteComponent {
  @Input() groceryItem: GroceryItem;
  @Input() visible: boolean;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onDeleted = new EventEmitter<GroceryItem>();

  constructor(
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  delete() {
    this.apiService.deleteGroceryItem(this.groceryItem.id).subscribe({
      next: (groceryItem: GroceryItem) => {
        this.toastService.handleSuccess('Grocery Item deleted');
        this.onDeleted.emit(groceryItem);
        this.visibleChange.emit(false);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error delete Grocery Item');
      },
    });
  }
}
