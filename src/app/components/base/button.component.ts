import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button #button
      [ngClass]="['button', type, variant, shape, size]"
      [class.disabled]="disabled"
      [class.visible]="visible"
      (click)="click()">
      
      <app-svg *ngIf="iconLeft" [path]="iconLeft" [size]="+iconSize"></app-svg>

      <app-svg *ngIf="icon" [path]="icon" [size]="+iconSize"></app-svg>

      <div *ngIf="label" class="button-label"> {{ label }}</div>
    </button>
  `,
  styles: [`
    .button {
      font-family: var(--font-family);
      font-feature-settings: var(--font-feature-settings);
      font-size: 1rem;
      border: 1px solid;
      cursor: pointer;
      transition: background-color 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      gap: 8px;
      min-height: 2.25rem;
      min-width: 2.25rem;

      &.large {
        min-height: 3rem;
        min-width: 3rem;
      }

      &.round {
        border-radius: 50%;
      }

      &.disabled {
        opacity: 0.6;
        cursor: auto;
      }

      &:not(.visible) {
        opacity: 0;
        cursor: auto;
      }

      /* --- Varianti --- */
      &.filled {
        background-color: var(--btn-color);
        color: var(--btn-text-color);
        border-color: var(--btn-color);

        app-svg { background-color: var(--btn-text-color); }
        &:not(.disabled):hover { background-color: var(--btn-hover-color); }
      }

      &.outlined {
        background-color: transparent;
        color: var(--btn-color);
        border-color: var(--btn-color);

        app-svg { background-color: var(--btn-color); }
        &:not(.disabled):hover { background-color: var(--btn-highlight-color); }
      }

      &.text {
        background-color: transparent;
        color: var(--btn-color);
        border-color: transparent;

        app-svg { background-color: var(--btn-color); }
        &:not(.disabled):hover { background-color: var(--btn-highlight-color); }
      }
    }

    /* --- Tipi: impostano solo le variabili --- */
    .button.primary {
      --btn-color: var(--primary);
      --btn-text-color: var(--primary-text);
      --btn-hover-color: var(--primary-hover);
      --btn-highlight-color: var(--primary-highlight);
    }

    .button.error {
      --btn-color: var(--error);
      --btn-text-color: var(--error-text);
      --btn-hover-color: var(--error-hover);
      --btn-highlight-color: var(--error-highlight);
    }

    .button.warning {
      --btn-color: var(--warning);
      --btn-text-color: var(--warning-text);
      --btn-hover-color: var(--warning-hover);
      --btn-highlight-color: var(--warning-highlight);
    }

    .button.success {
      --btn-color: var(--success-color);
      --btn-text-color: var(--success-text-color);
      --btn-hover-color: var(--success-hover-color);
      --btn-highlight-color: var(--success-highlight-color);
    }
  `]
})
export class ButtonComponent implements AfterViewInit {
  @ViewChild('button', { read: ElementRef }) buttonRef!: ElementRef<HTMLElement>;
  
  @Input() label: string;
  @Input() icon: string;
  @Input() iconLeft: string;
  @Input() iconSize: string = '16';

  @Input() variant: 'filled' | 'outlined' | 'text' = 'filled';
  @Input() type: 'primary' | 'error' | 'warning' | 'success' = 'primary';
  @Input() shape:  '' | 'round' = '';
  @Input() size: 'normal' | 'large' = 'normal';

  @Input() disabled = false;
  @Input() visible = true;

  /** Evento click */
  @Output() onClick = new EventEmitter<void>();

  color: string;

  ngAfterViewInit() {
    this.color = window.getComputedStyle(this.buttonRef.nativeElement).color;

    if (!this.label) {
      this.buttonRef.nativeElement.style.padding = "0.5rem";
    }
  }

  click() {
    if (!this.disabled && this.visible) {
      this.onClick.emit();
    }
  }
}
