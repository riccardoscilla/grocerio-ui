import { Component } from '@angular/core';

@Component({
  selector: 'app-list',
  template: `
    <div class="list">
      <ng-content></ng-content>
    </div>  
  `,
  styles: [`
    .list {
      padding: 8px 16px 68px;
    }

    .list ::ng-deep > * .item {
      border-bottom: 2px solid #f0f0f0;
    }

    .list ::ng-deep > *:last-child .item {
      border: none;
    }
  `]
})
export class ListComponent {

}
