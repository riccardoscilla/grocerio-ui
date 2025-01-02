import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../model/category';

@Component({
  selector: 'app-category-new',
  template: `
    <p-sidebar 
        [visible]="visible" 
        position="bottom" 
        (onHide)="onHide.emit()"
        [style]="{ height: '90vh' }" 
    >

        <ng-template pTemplate="header">
            <div style="font-size: 24px; font-weight: 500;">
                New Category
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

        <ng-template pTemplate="footer" >
            <p-button class="p-fluid" label="Salva" (click)="onSave.emit()" [disabled]="!category.valid()"/>
        </ng-template>

    </p-sidebar>
  `,
  styles: []
})
export class CategoryNewComponent {
    @Input() category: Category;
    @Input() visible: boolean;

    @Output() onHide = new EventEmitter<void>();
    @Output() onSave = new EventEmitter<void>();
}
