import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../../model/item';
import { Category } from '../../model/category';

@Component({
  selector: 'app-items-new',
  template: `
    <p-sidebar 
        [visible]="visible" 
        position="bottom" 
        (onHide)="onHide.emit()"
        [style]="{ height: '90vh' }" 
    >

        <ng-template pTemplate="header">
            <div style="font-size: 24px; font-weight: 500;">
                New Item
            </div>
        </ng-template>

        <ng-template pTemplate="content">

            <div style="display: flex; flex-direction: column; gap: 16px;">            
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    Name
                    <input type="text" pInputText [(ngModel)]="item.name" />   
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    Category
                    <p-dropdown 
                        [options]="categories" 
                        [(ngModel)]="item.category"
                        optionLabel="name"
                        placeholder="Select a Category"
                        class="p-fluid">
                        <ng-template pTemplate="selectedItem">
                            <div *ngIf="item.category">
                                {{ item.category.icon }} {{ item.category.name }}
                            </div>
                        </ng-template>
                        <ng-template let-category pTemplate="item">
                            <div>
                                {{ category.icon }} {{ category.name }}
                            </div>
                        </ng-template>
                    </p-dropdown>    
                </div>
            </div>

        </ng-template>

        <ng-template pTemplate="footer" >
            <p-button class="p-fluid" label="Salva" (click)="onSave.emit()" [disabled]="!item.valid()"/>
        </ng-template>

    </p-sidebar>
  `,
  styles: []
})
export class ItemsNewComponent {
    @Input() item: Item;
    @Input() categories: Category[];
    @Input() visible: boolean;

    @Output() onHide = new EventEmitter<void>();
    @Output() onSave = new EventEmitter<void>();
}
