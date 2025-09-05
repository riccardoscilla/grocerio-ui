import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GroceryItem } from '../../model/groceryItem';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-grocery-delete',
  template: `
    <app-bottom-sheet
      [visible]="visible"
      header="Delete Grocery Item"
      (closed)="onClosed.emit()"
    >
      <app-container content>
        Delete grocery item {{ groceryItem.icon }} {{ groceryItem.name }}?
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
export class GroceryDeleteComponent implements OnInit {
  @Input() groceryItem: GroceryItem;
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
    this.apiService.deleteGroceryItem(this.groceryItem.id).subscribe({
      next: (groceryItem: GroceryItem) => {
        this.toastService.handleSuccess('Grocery Item deleted');
        this.sharedDataService.groceryItemsData.delete([groceryItem]);
        this.onDeleted.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error delete Grocery Item');
      },
    });
  }
}
