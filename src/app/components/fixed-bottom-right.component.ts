import { Component } from '@angular/core';

@Component({
  selector: 'app-fixed-bottom-right',
  template: `
    <div class="fixed">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .fixed {
        position: absolute;
        bottom: 76px;
        right: 16px;

        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
  `]
})
export class FixedBottomRightComponent {

}
