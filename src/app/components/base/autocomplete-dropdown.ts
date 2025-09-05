import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-autocomplete-dropdown',
  template: `
    <ng-content select="[leading]"></ng-content>
    
    <div class="input-container">
      <input
        #inputElement
        type="text"
        [placeholder]="placeholder"
        [value]="searchTerm"
        (input)="onInputChange($event)"
        class="autocomplete-input"
        autocomplete="off"
      />
      
      <div class="input-icon" (click)="onOpenDropdown()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>

      <div class="dropdown" *ngIf="isOpen" [class.dropdown-above]="dropdownPosition === 'above'">
        <div class="dropdown-content">
          <!-- Bottone per aggiungere nuovo elemento -->
          <div
            *ngIf="showAddButton"
            class="dropdown-item add-new-item"
            (click)="handleAddNew()"
          >
            <app-svg path='plus.svg' [size]="12" />
            <span>Add "{{ searchTerm }}"</span>
          </div>
  
          <!-- Opzioni filtrate -->
          <div
            *ngFor="let option of filteredOptions; let i = index"
            class="dropdown-item"
            [class.selected]="getValue(option) === selectedValue"
            (click)="selectOption(option)"
          >
            <ng-container
              *ngIf="optionTemplate"
              [ngTemplateOutlet]="optionTemplate"
              [ngTemplateOutletContext]="{ $implicit: option, index: i}"
            ></ng-container>
          </div>
  
          <!-- Messaggio quando non ci sono risultati -->
          <div *ngIf="filteredOptions.length === 0 && !showAddButton" class="no-results">
            Nessun risultato trovato
          </div>        
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .input-container {
      position: relative;
      display: flex;
    }

    .autocomplete-input {
      width: 100%;
      font-family: var(--font-family);
      font-size: 1rem;
      color: var(--background-text-color);
      background: var(--background-color);
      padding: 0.75rem 2.5rem 0.75rem 0.75rem;
      border: 1px solid var(--background-border-color);
      border-radius: 8px;
      height: 40px;
      outline: none;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--background-border-highlight-color);
      }

      &:focus {
        border-color: var(--primary-color);
      }
    }

    .input-icon {
      position: absolute;
      right: 0;
      width: 40px;
      height: 100%;
      color: var(--background-border-highlight-color);
      cursor: pointer;

      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 1000;
      margin-top: 4px;

      &.dropdown-above {
        top: auto;
        bottom: 100%;
        margin-top: 0;
        margin-bottom: 4px;
      }
    }

    .dropdown-content {
      background: white;
      border: 1px solid var(--background-border-color);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      max-height: 200px;
      overflow-y: auto;
      padding: 4px;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.15s ease;
      font-size: 0.95rem;

      &:hover {
        background-color: var(--background-hover-color);
      }

      &.selected {
        background-color: var(--primary-highlight-color);
        color: var(--primary-color);
      }
    }

    .add-new-item {
      color: var(--primary-color);
    }
  `,
})
export class AutocompleteComponent<T> {
  @Input() placeholder: string = 'Seleziona o digita...';
  @Input() options: T[] = [];
  @Input() selectedOption: T;
  @Input() valueKey: string = 'value';
  @Input() labelKey: string = 'label';
  
  @Output() selectedOptionChange = new EventEmitter<T | undefined>();
  @Output() addNew = new EventEmitter<string>();
  
  @ContentChild('optionTemplate') optionTemplate!: TemplateRef<any>;
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  isOpen = false;
  dropdownPosition: 'below' | 'above' = 'below';
  searchTerm = '';
  selectedValue: string = '';
  filteredOptions: T[] = [];

  constructor(private elementRef: ElementRef) {}

  getValue(option: T): string {
    return this.valueKey.split('.').reduce((acc: any, key: any) => acc?.[key], option);
  }

  getLabel(option: T): string {
    return this.labelKey.split('.').reduce((acc: any, key: any) => acc?.[key], option);
  }

  ngOnInit() {
    this.filteredOptions = [...this.options];
    this.selectedValue = this.getValue(this.selectedOption);
    this.searchTerm = this.getLabel(this.selectedOption);
  }

  onOpenDropdown() {
    if (this.isOpen) {
      this.isOpen = false;
      return;
    }
    this.isOpen = true;
    this.calculateDropdownPosition();  
    this.filteredOptions = [...this.options];
    
    // Focus sull'input quando si apre tramite icona
    // setTimeout(() => {
    //   this.inputElement.nativeElement.focus();
    // }, 0);
  }

  onInputChange(event: any) {
    const value = event.target.value;
    this.searchTerm = value.trim();
    this.filterOptions();
    
    this.selectedOptionChange.emit(undefined);

    if (!this.isOpen) {
      this.onOpenDropdown();
    }
  }

  filterOptions() {
    // if (!this.searchTerm) {
    //   this.filteredOptions = [...this.options];
    // } else {
    // }
    this.filteredOptions = this.options.filter(option =>
      this.getLabel(option).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectOption(option: T) {
    this.selectedValue = this.getValue(option);
    this.searchTerm = this.getLabel(option);
    this.selectedOption = option;
    this.isOpen = false;

    // setTimeout(() => { // put cursor at the end of the input when select
    //   const input = this.inputElement.nativeElement;
    //   if (input) {
    //     const value = input.value;
    //     input.focus();
    //     input.setSelectionRange(value.length, value.length);
    //   }
    // }, 0);
    this.selectedOptionChange.emit(option);
  }

  get showAddButton(): boolean {
    if (!this.searchTerm)
      return false;
    const existExactMatch = this.filteredOptions.find(option => this.getLabel(option).toLowerCase() === this.searchTerm.toLowerCase()) !== undefined;
    return !existExactMatch;
  }

  handleAddNew() {
    if (this.searchTerm) {
      this.addNew.emit(this.searchTerm);
      this.isOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }

  private calculateDropdownPosition() {
    setTimeout(() => {
      const inputRect = this.inputElement.nativeElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 200; // altezza massima del dropdown
      const spaceBelow = viewportHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;

      // Se non c'è abbastanza spazio sotto ma c'è sopra, mostra sopra
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        this.dropdownPosition = 'above';
      } else {
        this.dropdownPosition = 'below';
      }
    });
  }
}
