import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  template: `
    <p-iconField iconPosition="left" class="p-fluid">
        <p-inputIcon styleClass="pi pi-search" />
        <input type="text" pInputText placeholder="Search" [(ngModel)]="searchText" (input)="onSearchTextChange()"/>
    </p-iconField>
  `,
  styles: [``]
})
export class SearchBarComponent {
    searchText: string = '';

    @Output() searchTextChanged = new EventEmitter<string>();
    
    onSearchTextChange() {
        this.searchTextChanged.emit(this.searchText);
    }
}
