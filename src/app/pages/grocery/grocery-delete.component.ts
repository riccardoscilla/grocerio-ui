import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../../model/item';
import { ListItem } from '../../model/listItem';

@Component({
  selector: 'app-grocery-delete',
  template: `
    <p-dialog *ngIf="visible"
        [header]="'Delete List Item'"
        [modal]="true" 
        [(visible)]="visible" 
        [style]="{ width: '90vw' }" 
        [draggable]="false" 
        [resizable]="false">

        <span>
          Delete list item {{listItem.icon }} {{listItem.name}}?
        </span>

        <ng-template pTemplate="footer">
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <p-button class="p-fluid" [outlined]="true" label="Delete" (click)="onDelete.emit()" />
          </div>
        </ng-template>
    </p-dialog>
  `,
  styles: []
})
export class GroceryDeleteComponent {
    @Input() listItem: ListItem;
    @Input() items: Item[];
    @Input() visible: boolean;

    @Output() onCancel = new EventEmitter<void>();
    @Output() onDelete = new EventEmitter<void>();
}
