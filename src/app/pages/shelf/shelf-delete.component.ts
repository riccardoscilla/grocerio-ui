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

        <!-- <div style="display: flex; gap: 8px; justify-content: center;">
          <p-button [outlined]="true" label="Delete" (click)="onDelete.emit()" />
          <p-button label="Delete and put in list" (click)="onDeleteAndInsertInList.emit()"  />
        </div> -->

        <ng-template pTemplate="footer">
          <div style="display: flex; justify-content: space-between;">
            <p-button [outlined]="true" label="Delete" (click)="onDelete.emit()" />
            <p-button label="Delete and put in list" (click)="onDeleteAndInsertInList.emit()"  />
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
