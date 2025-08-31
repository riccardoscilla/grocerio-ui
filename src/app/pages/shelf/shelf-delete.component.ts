import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShelfItem } from '../../model/shelfItem';
import { Item } from '../../model/item';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-shelf-delete',
  template: `
    <app-bottom-sheet
      [header]="'Delete Shelf Item'"
      (closed)="onClosed.emit()"
    >
      <app-container content>
        Delete shelf item {{ shelfItem.icon }} {{ shelfItem.name }}?
      </app-container>

      <app-container footer>
        <app-row>
          <p-button #fullflex label="Delete" [outlined]="true" severity="danger" (click)="delete()"/>
        </app-row>
        <app-row>
          <p-button #fullflex label="Delete and save in Grocery List" (click)="deleteAndSaveInList()" />
        </app-row>
      </app-container>
      
    </app-bottom-sheet>
  `,
  styles: [],
})
export class ShelfDeleteComponent {
  @Input() shelfItem: ShelfItem;
  // @Input() visible: boolean;
  visible = true

  // @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onClosed = new EventEmitter<void>();
  @Output() onDeleted = new EventEmitter<ShelfItem>();

  constructor(
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  delete() {
    this.apiService.deleteShelfItem(this.shelfItem.id).subscribe({
      next: (shelfItem: ShelfItem) => {
        this.toastService.handleSuccess('Shelf Item deleted');
        this.onDeleted.emit(shelfItem);
        // this.visibleChange.emit(false);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error delete Shelf Item');
      },
    });
  }

  deleteAndSaveInList() {
    this.apiService.moveShelfItemInGrocery(this.shelfItem.id).subscribe({
      next: (shelfItem: ShelfItem) => {
        this.toastService.handleSuccess('Shelf Item deleted and saved in Grocery List');
        this.onDeleted.emit(shelfItem);
        // this.visibleChange.emit(false);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error delete Shelf Item and save in Grocery List');
      },
    });
  }

  handleClosed() {
    this.visible = false;
    this.onClosed.emit();
  }
}
