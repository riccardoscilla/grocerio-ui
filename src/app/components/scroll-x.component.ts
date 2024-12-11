import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-scroll-x',
  template: `
    <div class="content">
        <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .content {
        width: 100%;
        overflow-x: auto;
        &::-webkit-scrollbar {
            display: none;
        }
        -ms-overflow-style: none;  /* For Internet Explorer and Edge */
        scrollbar-width: none;    /* For Firefox */

        display: flex; 
        gap: 8px;        
    }
    
  `]
})
export class ScrollXComponent {
}
