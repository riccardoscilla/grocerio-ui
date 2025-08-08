import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chip',
  template: `
    <p-chip [label]="label"/>
  `,
  styles: [`
  `]  
})
export class ChipComponent {
  @Input() label: string;
  @Input() selected: boolean;
}
