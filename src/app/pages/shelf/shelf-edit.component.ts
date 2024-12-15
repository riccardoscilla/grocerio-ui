import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShelfItem } from '../../model/shelfItem';
import { Item } from '../../model/item';

@Component({
  selector: 'app-shelf-edit',
  template: `
    <p-sidebar 
        [visible]="visible" 
        position="bottom" 
        (onHide)="onHide.emit()"
        [style]="{ height: '90vh' }" 
    >

        <ng-template pTemplate="header">
            <div style="font-size: 24px; font-weight: 500;">
                Edit Shelf Item
            </div>
        </ng-template>

        <ng-template pTemplate="content">

            <div style="display: flex; flex-direction: column; gap: 16px;">            
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    Item
                    <p-dropdown 
                        [options]="items" 
                        [(ngModel)]="shelfItem.item"
                        optionLabel="name"
                        placeholder="Select an Item"
                        class="p-fluid">
                        <ng-template pTemplate="selectedItem">
                            <div *ngIf="shelfItem.item">
                                {{ shelfItem.item.category.icon }} {{ shelfItem.item.name }}
                            </div>
                        </ng-template>
                        <ng-template let-item pTemplate="item">
                            <div>
                                {{ item.category.icon }} {{ item.name }}
                            </div>
                        </ng-template>
                    </p-dropdown>    
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    Quantity
                    <p-inputNumber 
                        [(ngModel)]="shelfItem.quantity" 
                        [showButtons]="true" 
                        buttonLayout="horizontal" 
                        inputId="horizontal" 
                        spinnerMode="horizontal" 
                        [step]="1"
                        [min]="0"
                        incrementButtonIcon="pi pi-plus" 
                        decrementButtonIcon="pi pi-minus"
                        class="p-fluid"
                    />
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    Purchase Date
                    <p-calendar 
                        [(ngModel)]="shelfItem.purchaseDate" 
                        [iconDisplay]="'input'" 
                        [showIcon]="true" 
                        [showButtonBar]="true"
                        [touchUI]="true" 
                        class="p-fluid"
                    />
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    Note
                    <textarea 
                        [(ngModel)]="shelfItem.note" 
                        rows="2"
                        cols="10" 
                        pInputTextarea 
                        [autoResize]="true"
                        class="p-fluid"    
                    >
                    </textarea>
                </div>
            </div>
            

        </ng-template>

        <ng-template pTemplate="footer" >
            <p-button class="p-fluid" label="Salva" (click)="onSave.emit()" [disabled]="!shelfItem.valid()"/>
        </ng-template>

    </p-sidebar>
  `,
  styles: []
})
export class ShelfEditomponent {
    @Input() shelfItem: ShelfItem;
    @Input() items: Item[];
    @Input() visible: boolean;

    @Output() onHide = new EventEmitter<void>();
    @Output() onSave = new EventEmitter<void>();
}