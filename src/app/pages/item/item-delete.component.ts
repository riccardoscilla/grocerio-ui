import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroceryItem } from '../../model/groceryItem';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Item } from '../../model/item';

@Component({
  selector: 'app-item-delete',
  template: `
    <p-dialog
      [(visible)]="visible"
      [draggable]="false"
      [resizable]="false"
      [modal]="true"
      [closable]="true"
      [dismissableMask]="true"
      [header]="'Delete Item'"
      (onHide)="visibleChange.emit(false)"
      position="bottom"
      class="bottom-sheet"
    >
      <app-container>
        Delete item {{ item.icon }} {{ item.name }}?
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
export class ItemDeleteComponent {
  @Input() item: Item;
  @Input() visible: boolean;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onDeleted = new EventEmitter<Item>();

  constructor(
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  delete() {
    this.apiService.deleteItem(this.item.id).subscribe({
      next: (item: Item) => {
        this.toastService.handleSuccess('Item deleted');
        this.onDeleted.emit(item);
        this.visibleChange.emit(false);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error delete Item');
      },
    });
  }
}
