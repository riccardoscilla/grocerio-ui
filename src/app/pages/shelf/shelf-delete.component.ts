import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShelfItem } from '../../model/shelfItem';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-shelf-delete',
  template: `
    <app-bottom-sheet
      [visible]="visible"
      header="Delete Shelf Item"
      (closed)="onClosed.emit()"
    >
      <app-container content>
        Delete shelf item {{ shelfItem.icon }} {{ shelfItem.name }}?
      </app-container>

      <app-container footer>
        <app-row>
          <app-button #fullflex label="Delete" type="error" (onClick)="delete()" />
        </app-row>
        <app-row>
          <app-button #fullflex label="Move in Grocery List" (onClick)="deleteAndSaveInList()" />
        </app-row>
      </app-container>
      
    </app-bottom-sheet>
  `,
  styles: [],
})
export class ShelfDeleteComponent implements OnInit{
  @Input() shelfItem: ShelfItem;
  @Output() onClosed = new EventEmitter<void>();
  @Output() onDeleted = new EventEmitter<void>();

  visible = false

  constructor(
    public sharedDataService: SharedDataService,
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.visible = true;
  }

  delete() {
    this.apiService.deleteShelfItem(this.shelfItem.id).subscribe({
      next: (shelfItem: ShelfItem) => {
        this.toastService.handleSuccess('Shelf Item deleted');
        this.sharedDataService.shelfItemsData.delete([shelfItem]);
        this.onDeleted.emit();
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
        this.sharedDataService.shelfItemsData.delete([shelfItem]);
        this.onDeleted.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error delete Shelf Item and save in Grocery List');
      },
    });
  }
}
