import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShelfItem } from '../../model/shelfItem';
import { Item } from '../../model/item';

@Component({
  selector: 'app-shelf-delete',
  template: `
    <p-dialog *ngIf="visible"
        [header]="'Delete Shelf Item'"
        [modal]="true" 
        [(visible)]="visible" 
        [style]="{ width: '90vw' }" 
        [draggable]="false" 
        [resizable]="false">

        <span>
          Delete shelf item {{shelfItem.icon }} {{shelfItem.name}}?
        </span>

        <ng-template pTemplate="footer">
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <p-button class="p-fluid" [outlined]="true" label="Delete" (click)="onDelete.emit()" />
            <p-button class="p-fluid" label="Delete and put in list" (click)="onDeleteAndInsertInList.emit()"  />
          </div>
        </ng-template>
    </p-dialog>
  `,
  styles: []
})
export class ShelfDeleteComponent {
    @Input() shelfItem: ShelfItem;
    @Input() items: Item[];
    @Input() visible: boolean;

    @Output() onCancel = new EventEmitter<void>();
    @Output() onDelete = new EventEmitter<void>();
    @Output() onDeleteAndInsertInList = new EventEmitter<void>();
}
