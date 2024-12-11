import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../model/category';

@Component({
  selector: 'app-category-filter',
  template: `
    <p-sidebar 
        [visible]="true" 
        position="bottom" 
        (onHide)="onHide.emit()"
        [style]="getStyle()"
    >

        <ng-template pTemplate="header">
            <div style="font-size: 24px; font-weight: 500;">
                Categories
            </div>
        </ng-template>

        <ng-template pTemplate="content">
            <div class="content">
                <div class="category" *ngFor="let category of categories">
                    <div class="category-icon">
                        <div class="icon" [ngClass]="{'selected': isSelectedCategory(category)}" (click)="selectCategory(category)">
                            {{ category.icon }}
                        </div>
                        <div  class="text">
                            {{category.name}}
                        </div>
                    </div>
                    
                </div>
            </div>
        </ng-template>

        <ng-template pTemplate="footer" >
            <p-button class="p-fluid" label="Apply" (click)="onApply.emit(selectedCategories)"/>
        </ng-template>

    </p-sidebar>


        
  `,
  styles: [`
    .content {
        display: flex; 
        flex-wrap: wrap; 
        row-gap: 24px;
    }
    .category {
        width: calc(100% / 4); 
        display: flex; 
        align-items: center;  
        justify-content: center; 
        font-size: 24px;
    }
    .category-icon {
        display: flex; 
        flex-direction: column;
        align-items: center;
        gap: 4px;       
    }
    .icon {
        width: 60px;
        height: 60px; 
        display: flex; 
        align-items: center;  
        justify-content: center; 
        background-color: #e5e7eb; 
        border-radius: 50%; 
        cursor: pointer;

        &.selected {
            border: 2px solid red;
        }
    }
    .text {
        font-size: 16px;
        text-align: center;
        height: 40px;
    }

  `]
})
export class CategoryFilterComponent implements OnInit {
    @Input() categories: Category[]
    @Input() selectedCategories: Category[]

    @Output() onHide = new EventEmitter<void>()
    @Output() onApply = new EventEmitter<Category[]>()

    ngOnInit(): void {
        this.selectedCategories = [...this.selectedCategories]
    }

    isSelectedCategory(category: Category) {
        return this.selectedCategories.filter(c => c.id === category.id).length === 1
    }

    selectCategory(category: Category) {
        if (this.isSelectedCategory(category)) 
            this.selectedCategories = this.selectedCategories.filter(c => c.id !== category.id)
        else
            this.selectedCategories.push(category)
    }

    getStyle() {
        return {height: '70vh', 'border-radius': '16px 16px 0 0'}
    }
}
