import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button #button
      [ngClass]="['button', type, variant, shape, size]"
      [class.disabled]="disabled"
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
      // line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .button.disabled {
      opacity: 0.6;
      cursor: auto;
    }
    
    .button {
      padding: 0.5rem 1rem;
      border-radius: 8px;

      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 8px;

      min-height: 2.25rem;
      min-width: 2.25rem;

      &.large {
        min-height: 3rem;
        min-width: 3rem;
      }
    }

    .button.round {
      border-radius: 50%;
    }

    /* ---------- PRIMARY ---------- */
    .button.primary.filled { 
      background-color: var(--primary-color); 
      color: var(--primary-text-color); 
      border-color: var(--primary-color);

      app-svg { background-color: var(--primary-text-color); }

      &:not(.disabled):hover { background-color: var(--primary-hover-color); }
    }

    .button.primary.outlined { 
      background-color: var(--background-color); 
      color: var(--primary-color); 
      border-color: var(--primary-color);

      app-svg { background-color: var(--primary-color); }

      &:not(.disabled):hover { background-color: var(--primary-highlight-color); }
    }

    .button.primary.text { 
      background-color: var(--background-color); 
      color: var(--primary-color); 
      border-color: var(--background-color);

      app-svg { background-color: var(--primary-color); }

      &:not(.disabled):hover { background-color: var(--primary-highlight-color); }
    }

    /* ---------- ERROR ---------- */
    .button.error.filled { 
      background-color: var(--error-color); 
      color: var(--error-text-color); 
      border-color: var(--error-color);

      app-svg { background-color: var(--error-text-color); }

      &:not(.disabled):hover { background-color: var(--error-hover-color); }
    }

    .button.error.outlined { 
      background-color: var(--background-color); 
      color: var(--error-color); 
      border-color: var(--error-color);

      app-svg { background-color: var(--error-color); }

      &:not(.disabled):hover { background-color: var(--error-highlight-color); }
    }

    .button.error.text { 
      background-color: var(--background-color); 
      color: var(--error-color); 
      border-color: var(--background-color);

      app-svg { background-color: var(--error-color); }

      &:not(.disabled):hover { background-color: var(--error-highlight-color); }
    }

    /* ---------- WARNING ---------- */
    .button.warning.filled { 
      background-color: var(--warning-color); 
      color: var(--warning-text-color); 
      border-color: var(--warning-color);

      app-svg { background-color: var(--warning-text-color); }

      &:not(.disabled):hover { background-color: var(--warning-hover-color); }
    }

    .button.warning.outlined { 
      background-color: var(--background-color); 
      color: var(--warning-color); 
      border-color: var(--warning-color);

      app-svg { background-color: var(--warning-color); }

      &:not(.disabled):hover { background-color: var(--warning-highlight-color); }
    }

    .button.warning.text { 
      background-color: var(--background-color); 
      color: var(--warning-color); 
      border-color: var(--background-color);

      app-svg { background-color: var(--warning-color); }

      &:not(.disabled):hover { background-color: var(--warning-highlight-color); }
    }

    /* ---------- SUCCESS ---------- */
    .button.success.filled { 
      background-color: var(--success-color); 
      color: var(--success-text-color); 
      border-color: var(--success-color);

      app-svg { background-color: var(--success-text-color); }

      &:not(.disabled):hover { background-color: var(--success-hover-color); }
    }

    .button.success.outlined { 
      background-color: var(--background-color); 
      color: var(--success-color); 
      border-color: var(--success-color);

      app-svg { background-color: var(--success-color); }

      &:not(.disabled):hover { background-color: var(--success-highlight-color); }
    }

    .button.success.text { 
      background-color: var(--background-color); 
      color: var(--success-color); 
      border-color: var(--background-color);

      app-svg { background-color: var(--success-color); }

      &:not(.disabled):hover { background-color: var(--success-highlight-color); }
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
    if (!this.disabled) {
      this.onClick.emit();
    }
  }
}
