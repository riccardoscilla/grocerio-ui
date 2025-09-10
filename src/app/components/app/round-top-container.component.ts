import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-round-top-container',
  template: `
      <ng-content></ng-content>
  `,
  styles: [
    `
      :host {
        display: flex;        
        position: relative;
        background-color: var(--primary);
      }

      :host::before {
        content: '';
        position: absolute;
        background-color: transparent;
        bottom: -32px;
        left: 0;
        height: 32px;
        width: 16px;
        border-top-left-radius: 16px;
        box-shadow: 0 -16px 0 0 var(--primary);
      }

      :host::after {
        content: '';
        position: absolute;
        background-color: transparent;
        bottom: -32px;
        right: 0;
        height: 32px;
        width: 16px;
        border-top-right-radius: 16px;
        box-shadow: 0 -16px 0 0 var(--primary);
      }
    `,
  ],
})
export class RoundTopContainerComponent {
  @Input() title?: string;
  @Input() defaultTitle: string;
  @Input() back: string;
  @Input() search: boolean = false;
  @Input() menu: boolean = false;

  constructor(private router: Router) {}

  goBack() {
    this.router.navigateByUrl(this.back);
  }

  getTitle() {
    if (this.title) return this.title;
    return this.defaultTitle;
  }

  items: MenuItem[] = [
    {
      label: 'Update',
      command: () => {},
    },
    {
      label: 'Delete',
      command: () => {},
    },
  ];
}
