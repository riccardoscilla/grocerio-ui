import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../model/category';

@Component({
  selector: 'app-filter-button',
  template: `
    <p-button (click)="toggleFilter.emit()" severity="secondary"> 
      <app-svg [color]="'black'" [size]="19" [path]="'settings-sliders.svg'"></app-svg>
    </p-button>       
  `,
  styles: [``]
})
export class FilterButtonComponent {
    @Input() selectedCategories: Category[]
    @Output() toggleFilter = new EventEmitter<void>()
}
