import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShelfItem } from '../../model/shelfItem';
import { Item } from '../../model/item';
import { Category } from '../../model/category';

@Component({
  selector: 'app-item-edit',
  template: `
    <p-sidebar 
        [visible]="visible" 
        position="bottom" 
        (onHide)="onHide.emit()"
        [style]="{ height: '90vh' }" 
    >

        <ng-template pTemplate="header">
            <div style="font-size: 24px; font-weight: 500;">
                Edit Item
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
                <div style="display: flex; align-items: center; gap: 16px; padding-top: 8px;">
                    <p-checkbox [binary]="true" variant="filled" [(ngModel)]="item.favourite"/>
                    Favourite
                </div>
            </div>
            

        </ng-template>

        <ng-template pTemplate="footer" >
            <div style="display: flex; gap: 8px">
                <p-button class="p-flex" [outlined]="true" severity="danger" label="Delete" (click)="onDelete.emit()" [disabled]="item && !item.valid()"/>
                <p-button class="p-flex" label="Save" (click)="onSave.emit()" [disabled]="item && !item.valid()"/>
            </div>  
        </ng-template>

    </p-sidebar>
  `,
  styles: []
})
export class ItemEditComponent {
    @Input() item: Item;
    @Input() categories: Category[];
    @Input() visible: boolean;

    @Output() onHide = new EventEmitter<void>();
    @Output() onSave = new EventEmitter<void>();
    @Output() onDelete = new EventEmitter<void>();
}
