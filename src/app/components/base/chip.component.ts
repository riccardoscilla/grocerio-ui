import { AfterContentInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-chip',
  template: `
    <p-chip [label]="label" [class.selected]="selected === true"/>
  `,
  styles: [`
    ::ng-deep p-chip.selected .p-chip {
      border: 1px solid var(--primary);
    }
  `]  
})
export class ChipComponent {
  @Input() label: string;
  @Input() selected: boolean;
}
