import { Component } from '@angular/core';

@Component({
  selector: 'app-fixed-bottom',
  template: `
    <div class="fixed">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .fixed {
      position: fixed;
      bottom: 0;
      width: 100vw;
      height: 60px;
      padding: 0 8px 0;

      border-top: 2px solid #f0f0f0;
      border-radius: 16px;
    }

    @media (min-width: 500px) { 
      .fixed {
          width: 500px;
      }
    }
  `]
})
export class FixedBottomComponent {

}
