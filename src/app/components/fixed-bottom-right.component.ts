import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-fixed-bottom-right',
  template: `
    <div class="fixed" *ngIf="scrollPosition < 64">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .fixed {
        position: fixed;
        bottom: 76px;
        width: 100vw;
        padding: 0 16px;

        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        gap: 8px;
    }

    @media (min-width: 500px) { 
      .fixed {
          width: 500px;
      }
    }
  `]
})
export class FixedBottomRightComponent {
  scrollPosition = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrollPosition = window.scrollY || document.documentElement.scrollTop;
  }  

}
