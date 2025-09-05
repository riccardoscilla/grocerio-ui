import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  template: `
    <div class="input-container">
      <div
        #inputElement
        class="dropdown-input"
        (click)="onOpenDropdown()"
      >
        <ng-container
          *ngIf="selectedOptionTemplate && selectedOption"
          [ngTemplateOutlet]="selectedOptionTemplate"
          [ngTemplateOutletContext]="{ $implicit: selectedOption}"
        ></ng-container>

        <span *ngIf="!selectedOption">{{placeholder}}</span>
      </div>
      
      <div class="input-icon" (click)="onOpenDropdown()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>

      <div class="dropdown" *ngIf="isOpen" [class.dropdown-above]="dropdownPosition === 'above'">
        <div class="dropdown-content">
          <div
            *ngFor="let option of options; let i = index"
            class="dropdown-item"
            [class.selected]="getValue(option) === getValue(selectedOption)"
            (click)="selectOption(option)"
          >
            <ng-container
              *ngIf="optionTemplate"
              [ngTemplateOutlet]="optionTemplate"
              [ngTemplateOutletContext]="{ $implicit: option, index: i}"
            ></ng-container>
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

    .dropdown-input {
      width: 100%;
      font-family: var(--font-family);
      font-size: 1rem;
      color: var(--background-text-color);
      background: var(--background-color);
      display: flex;
      align-items: center;
      padding-left: 0.75rem;

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
export class DropdownComponent<T> {
  @Input() placeholder: string = 'Seleziona o digita...';
  @Input() options: T[] = [];
  @Input() selectedOption: T;
  @Input() valueKey: string = 'value';
  @Input() labelKey: string = 'label';
  
  @Output() selectedOptionChange = new EventEmitter<T | undefined>();
  @Output() addNew = new EventEmitter<string>();
  
  @ContentChild('selectedOptionTemplate') selectedOptionTemplate!: TemplateRef<any>;
  @ContentChild('optionTemplate') optionTemplate!: TemplateRef<any>;
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  isOpen = false;
  dropdownPosition: 'below' | 'above' = 'below';

  constructor(private elementRef: ElementRef) {}

  getValue(option: T): string {
    return this.valueKey.split('.').reduce((acc: any, key: any) => acc?.[key], option);
  }

  getLabel(option: T): string {
    return this.labelKey.split('.').reduce((acc: any, key: any) => acc?.[key], option);
  }

  ngOnInit() {
  }

  onOpenDropdown() {
    if (this.isOpen) {
      this.isOpen = false;
      return;
    }
    this.isOpen = true;
    this.calculateDropdownPosition();  
  }

  selectOption(option: T) {
    this.selectedOption = option;
    this.isOpen = false;
    this.selectedOptionChange.emit(option);
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
