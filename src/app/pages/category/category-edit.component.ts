import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../model/category';

@Component({
  selector: 'app-category-edit',
  template: `
    <p-sidebar 
        [visible]="visible" 
        position="bottom" 
        (onHide)="onHide.emit()"
        [style]="{ height: '90vh' }" 
    >

        <ng-template pTemplate="header">
            <div style="font-size: 24px; font-weight: 500;">
                Edit Category
            </div>
        </ng-template>

        <ng-template pTemplate="content">

        <div style="display: flex; flex-direction: column; gap: 16px;">            
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    Name
                    <input type="text" pInputText [(ngModel)]="category.name" />   
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    Icon
                    <input type="text" pInputText [(ngModel)]="category.icon" />   
                </div>
            </div>
            

        </ng-template>

        <ng-template pTemplate="footer">
            <div style="display: flex; gap: 8px">
                <p-button class="p-flex" [outlined]="true" severity="danger" label="Delete" (click)="onDelete.emit()" [disabled]="category && !category.valid()"/>
                <p-button class="p-flex" label="Save" (click)="onSave.emit()" [disabled]="category && !category.valid()"/>
            </div>  
        </ng-template>

    </p-sidebar>
  `,
  styles: []
})
export class CategoryEditComponent {
    @Input() category: Category;
    @Input() visible: boolean;

    @Output() onHide = new EventEmitter<void>();
    @Output() onSave = new EventEmitter<void>();
    @Output() onDelete = new EventEmitter<void>();
}
