import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../../model/item';
import { ListItem } from '../../model/listItem';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Category } from '../../model/category';

@Component({
  selector: 'app-grocery-new',
  template: `
    <p-sidebar 
        [visible]="visible" 
        position="bottom" 
        (onHide)="onHide.emit()"
        [style]="{ height: '90vh' }" 
    >

        <ng-template pTemplate="header">
            <div style="font-size: 24px; font-weight: 500;">
                New List Item
            </div>
        </ng-template>

        <ng-template pTemplate="content">

            <div style="display: flex; flex-direction: column; gap: 16px;">            
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    Item
                    <div style="display: flex; width: 100%; gap: 8px;">
                        <p-dropdown 
                            [options]="categories" 
                            [(ngModel)]="listItem.category"
                            optionLabel="name">
                            <ng-template pTemplate="selectedItem">
                                <div *ngIf="listItem.category">
                                    {{ listItem.category.icon }}
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
                            [(ngModel)]="listItem.item.name"
                            [dropdown]="true"
                            (completeMethod)="filterItem($event)"
                            (onSelect)="selectItem($event)"
                            optionLabel="name"
                            [autofocus]="true"
                            class="p-flex">
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
                    <p-inputGroup>
                        <button type="button" pButton icon="pi pi-minus" (click)="listItem.minusQuantity()"></button>
                        <input type="text" pInputText [(ngModel)]="listItem.quantity" [readOnly]="true" />
                        <button type="button" pButton icon="pi pi-plus" (click)="listItem.plusQuantity()"></button>
                    </p-inputGroup>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    Insertion Date
                    <p-calendar 
                        [(ngModel)]="listItem.insertionDate" 
                        [iconDisplay]="'input'" 
                        [showIcon]="true" 
                        [showButtonBar]="true"
                        [touchUI]="true" 
                        class="p-fluid"
                    />
                </div>
                <div style="display: flex; align-items: center; gap: 16px; padding-top: 8px;">
                    <p-toggleButton [(ngModel)]="listItem.item.favourite" 
                        onLabel="Favourite"
                        offLabel="Favourite" 
                        onIcon="pi pi-heart-fill"
                        offIcon="pi pi-heart"
                    />
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    Note
                    <textarea 
                        [(ngModel)]="listItem.note" 
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
            <p-button class="p-fluid" label="Save" (click)="onSave.emit()" [disabled]="!listItem.valid()"/>
        </ng-template>

    </p-sidebar>
  `,
  styles: []
})
export class GroceryNewComponent {
    @Input() listItem: ListItem;
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
        this.listItem.item = item.deepcopy()
    }
}
