import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-item-arrow',
  template: `
    <div class="item" style="height: 48px; display: flex; align-items: center; justify-content: space-between;" >
      {{mainText}}
      <p-button [text]="true" [rounded]="true" (click)="goTo()">
          <ng-template pTemplate="icon">
              <app-svg [color]="'black'" [size]="18" [path]="'angle-small-right.svg'"></app-svg>
          </ng-template>
      </p-button>
    </div>
  `,
  styles: [``]
})
export class ListItemArrowComponent {
  @Input() mainText: string;
  @Input() url: string;

  constructor(
    private router: Router
  ) {}

  goTo() {
    this.router.navigateByUrl(this.url);
  }

}
