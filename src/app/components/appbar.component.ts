import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-appbar',
  template: `
    <div class="content">
        <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .content {
        background-color: var(--primary-color); 
        box-shadow: -1px -2px 0px 0 var(--primary-color);
        position: sticky;
        top: 0;

        z-index: 1000;

        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px 16px;
    }

    .content::before {
        content: "";
        position: absolute;
        background-color: transparent;
        bottom: -32px;
        left: 0;
        height: 32px;
        width: 16px;
        border-top-left-radius: 16px;
        box-shadow: -1px -16px 0 0 var(--primary-color);
    }

    .content::after {
        content: "";
        position: absolute;
        background-color: transparent;
        bottom: -32px;
        right: 0;
        height: 32px;
        width: 16px;
        border-top-right-radius: 16px;
        box-shadow: 1px -16px 0 0 var(--primary-color);
    }

  `]
})
export class AppBarComponent {
}
