import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-new-button',
  template: `
    <p-button [rounded]="true" (click)="toggleShowNew.emit()" [style]="{ height: '48px', width: '48px' }" >
        <ng-template pTemplate="icon">
            <app-svg [color]="'white'" [size]="20" [path]="'plus.svg'"></app-svg>
        </ng-template>
    </p-button>
  `,
  styles: [``]
})
export class NewButtonComponent {
    @Output() toggleShowNew = new EventEmitter<void>();
}
