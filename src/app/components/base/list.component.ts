import { Component } from '@angular/core';

@Component({
  selector: 'app-list',
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
    }

    :host ::ng-deep > * {
      border-bottom: 1px solid var(--background-border-color);
    }

    :host ::ng-deep > *:last-child {
      border: none;
    }
  `]
})
export class ListComponent {

}
