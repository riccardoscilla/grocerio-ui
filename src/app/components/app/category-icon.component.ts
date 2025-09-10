import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-icon',
  template: `
    <span class="icon" *ngIf="!icon" >
      <p-avatar styleClass="mr-2" shape="circle" />
    </span>
    <span class="icon" *ngIf="icon" >
      {{ icon }}
    </span>
    <div class="favourite-icon" *ngIf="favourite">
      <app-svg [color]="'var(--text-base)'" [size]="14" [path]="'circle-heart.svg'"></app-svg>
    </div>
  `,
  styles: `
    :host {
      position: relative;
      font-size: 20px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .favourite-icon {
      position: absolute; 
      display: flex; 
      bottom: -4px; 
      right: -4px;
      background-color: transparent;
      border-radius: 50%;
      padding: 0.7px;
    }
  `
})
export class CategoryIconComponent {
  @Input() icon?: string;
  @Input() favourite: boolean;
}
