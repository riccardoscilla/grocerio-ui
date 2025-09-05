import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Item } from '../../model/item';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-item-delete',
  template: `
    <app-bottom-sheet
      [visible]="visible"
      header="Delete Item"
      (closed)="onClosed.emit()"
    >
      <app-container content>
        Delete item {{ item.icon }} {{ item.name }}?
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
export class ItemDeleteComponent implements OnInit {
  @Input() item: Item;
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
    this.apiService.deleteItem(this.item.id).subscribe({
      next: (item: Item) => {
        this.toastService.handleSuccess('Item deleted');
        this.sharedDataService.itemsData.delete([item]);
        this.onDeleted.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error delete Item');
      },
    });
  }
}
