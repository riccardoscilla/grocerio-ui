import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-appbar',
  template: `
    <ng-content select="[title]"></ng-content>

    <ng-content select="[content]"></ng-content>

    <ng-content select="[menu]"></ng-content>
  `,
  styles: [`
    
  `]  
})
export class AppBarComponent {
}
