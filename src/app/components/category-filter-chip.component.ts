import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../model/category';

@Component({
  selector: 'app-category-filter-chip',
  template: `
    <p-chip (click)="toggleFilter.emit()">
        <div style="height: 25px; display: flex; gap: 4px; align-items: center;">
            <div>Category</div>
            <div *ngIf="selectedCategories.length > 0" 
                style="width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                {{selectedCategories.length}}
            </div>
        </div>
    </p-chip>        
  `,
  styles: [``]
})
export class CategoryFilterChipComponent {
    @Input() selectedCategories: Category[]
    @Output() toggleFilter = new EventEmitter<void>()
}
