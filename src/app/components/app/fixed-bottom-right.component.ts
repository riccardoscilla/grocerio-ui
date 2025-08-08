import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-fixed-bottom-right',
  template: `
    <div class="fixed" *ngIf="show">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .fixed {
        position: fixed;
        bottom: 76px;
        right: 0;
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
  show = true;
  lastPixelFromTop = 0;

  @HostListener('window:scroll', [])
  onScroll(): void {
    const pixelsFromTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollingTop = pixelsFromTop < this.lastPixelFromTop 

    if (!scrollingTop && pixelsFromTop > 64)
      this.show = false
    else if (scrollingTop)
      this.show = true

    this.lastPixelFromTop = Math.max(pixelsFromTop, 0)
  }

}
