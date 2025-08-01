import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fixed',
  template: `
    <div *ngIf="spacer" [ngStyle]="{ height: spacerHeight }"></div>
    <div class="fixed" [ngStyle]="{ bottom: bottomOffset }">
      <ng-content></ng-content>
    </div>
  `,
  styles: `
  .fixed {
      position: fixed;
      bottom: 0;
      width: 100vw;
 
    }

    @media (min-width: 500px) { 
      .fixed {
          width: 500px;
      }
    }
  `
})
export class FixedComponent {
  @Input() spacer: boolean = true;
  @Input() spacerHeight: string = '64px';
  @Input() bottomOffset: string = '0px';
}
