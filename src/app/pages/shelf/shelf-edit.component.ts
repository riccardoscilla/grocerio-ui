import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShelfItem } from '../../model/shelfItem';
import { Item } from '../../model/item';
import { Category } from '../../model/category';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

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
                    <div style="display: flex; width: 100%; gap: 8px;">
                        <p-dropdown 
                            [options]="categories" 
                            [(ngModel)]="shelfItem.category"
                            optionLabel="name">
                            <ng-template pTemplate="selectedItem">
                                <div *ngIf="shelfItem.category">
                                    {{ shelfItem.category.icon }}
                                </div>
                            </ng-template>
                            <ng-template let-category pTemplate="item">
                                <div>
                                    {{ category.icon }} {{ category.name }}
                                </div>
                            </ng-template>
                        </p-dropdown>    

                        <p-autoComplete
                            [suggestions]="filteredItems"
                            [(ngModel)]="shelfItem.item.name"
                            [dropdown]="true"
                            (completeMethod)="filterItem($event)"
                            (onSelect)="selectItem($event)"
                            optionLabel="name">
                            <ng-template let-item pTemplate="item">
                                <div>
                                    {{ item.category.icon }} {{ item.name }}
                                </div>
                            </ng-template>
                        </p-autoComplete>
                    </div>
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
            <p-button class="p-fluid" label="Salva" (click)="onSave.emit()" [disabled]="shelfItem && !shelfItem.valid()"/>
        </ng-template>

    </p-sidebar>
  `,
  styles: []
})
export class ShelfEditomponent {
    @Input() shelfItem: ShelfItem;
    @Input() items: Item[];
    @Input() categories: Category[];
    @Input() visible: boolean;

    @Output() onHide = new EventEmitter<void>();
    @Output() onSave = new EventEmitter<void>();

    filteredItems: Item[]

    filterItem(event: AutoCompleteCompleteEvent) {
        this.filteredItems = [...this.items.filter(i => i.name.toLowerCase().indexOf(event.query.toLowerCase()) == 0)]
    }

    selectItem(event: any) {
        const item = event.value as Item
        this.shelfItem.item = item.deepcopy()
    }
}
