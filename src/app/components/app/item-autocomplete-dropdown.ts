import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Item } from '../../model/item';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
  AutoCompleteDropdownClickEvent,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { ItemsData } from '../../data/data';

@Component({
  selector: 'app-item-autocomplete-dropdown',
  template: `
    <app-row>
      <app-category-icon [icon]="getIcon()" />

      <p-autoComplete
        #fullflex
        #autocompleteItem
        [(ngModel)]="selectedItem"
        [suggestions]="itemsData.filteredItems"
        [dropdown]="true"
        [showEmptyMessage]="false"
        (completeMethod)="onInput($event)"
        (input)="onInputEmpty($event)"
        (onDropdownClick)="onDropdownClick($event)"
        (onSelect)="onSelect($event)"
        optionLabel="name"
      >
        <ng-template let-item pTemplate="item">
          <div>{{ item.category.icon }} {{ item.name }}</div>
        </ng-template>
      </p-autoComplete>
    </app-row>
  `,
  styles: `
    :host {
    }
  `,
})
export class ItemAutocompleteDropdownComponent {
  @Input() itemsData: ItemsData;
  @Input() selectedItem: Item | string;
  @Output() selectedItemChange = new EventEmitter<Item | string>();
  @ViewChild('autocompleteItem') autocompleteItem!: AutoComplete;

  onInput(event: AutoCompleteCompleteEvent) {
    const value = event.query;

    if (value.trim() === '')
      return;

    this.itemsData.filter(value);
    this.selectedItemChange.emit(value);
  }

  onInputEmpty(event: any) {
    const value = event.target.value;

    if (value.trim() === '') {
      this.selectedItemChange.emit(value);
    }
  }

  onDropdownClick(event: AutoCompleteDropdownClickEvent) {
    this.itemsData.init(this.itemsData.items);
  }

  onSelect(event: AutoCompleteSelectEvent) {
    setTimeout(() => {
      const input = this.autocompleteItem.inputEL?.nativeElement;
      if (input) {
        const value = input.value;
        input.focus();
        input.setSelectionRange(value.length, value.length);
      }
    }, 0);

    this.selectedItemChange.emit(event.value);
  }

  onClear() {
    console.log("clear ")
    this.selectedItemChange.emit(undefined);
  }

  getIcon(): string | undefined {
    if (
      typeof this.selectedItem === 'string' ||
      this.selectedItem === undefined
    ) {
      return undefined;
    }
    return this.selectedItem.icon;
  }
}
