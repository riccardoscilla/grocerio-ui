import { Component } from '@angular/core';

@Component({
  selector: 'app-list',
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      // padding: 0 16px;
      display: flex;
      flex-direction: column;
    }

    :host ::ng-deep > * {
      border-bottom: 2px solid var(--background-border-color);
    }

    :host ::ng-deep > *:last-child {
      border: none;
    }
  `]
})
export class ListComponent {

}
