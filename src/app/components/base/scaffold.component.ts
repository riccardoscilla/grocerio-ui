import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-scaffold',
  template: `
    <div class="scaffold-appbar">
      <ng-content select="[appbar]"></ng-content>
    </div>

    <div #contentContainer class="scaffold-content">
      <ng-content select="[content]"></ng-content>
    </div>

    
    <div class="scaffold-bottomtabbar">
      <ng-content select="[bottomtabbar]"></ng-content>
      
      <div #fabContainer class="scaffold-fab" *ngIf="showFab">
        <ng-content select="[fab]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    // :host {
    //   display: block;
    //   height: 100vh;
    // }

    :host {
      display: flex;
      flex-direction: column;
      height: 100dvh;
      width: 100%;

      // position: relative;
    }

    .scaffold-appbar {
      // flex: 0 0 auto;
    }

    .scaffold-bottomtabbar {
      // flex: 0 0 auto;
      position: relative;
    }

    .scaffold-fab {
      position: absolute;
      // top: -76px;
      right: 16px;
      // bottom: calc(60px + 16px);
    }

    .scaffold-content {
      flex: 1;
      // flex: 1 1 auto;
      overflow-y: auto;

      // &::-webkit-scrollbar {
      //     display: none;
      // }
      // -ms-overflow-style: none;  /* For Internet Explorer and Edge */
      // scrollbar-width: none;    /* For Firefox */
    }
  `]
})
export class ScaffoldComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contentContainer') contentRef!: ElementRef<HTMLDivElement>;
  @ViewChild('fabContainer') fabRef!: ElementRef;


  showFab = true;
  private onScroll = () => {};
  private lastScrollTop = 0;

  constructor(private hostRef: ElementRef, private renderer: Renderer2) {}
  

  ngAfterViewInit() {
    this.initScroll();
    this.setFabHeight();
  }

  initScroll() {
    this.onScroll = () => {
      const scrollTop = this.contentRef.nativeElement.scrollTop;
      
      if (scrollTop < this.lastScrollTop) {
        this.showFab = true;
        this.setFabHeight();
      } else if (scrollTop > 10) {
        this.showFab = false;
      }
      this.lastScrollTop = scrollTop;
    };

    this.contentRef.nativeElement.addEventListener('scroll', this.onScroll);
  }

  setFabHeight() {
    setTimeout(() => {
      const fabHeight = this.fabRef.nativeElement.offsetHeight;
      this.renderer.setStyle(this.fabRef.nativeElement, 'top', `-${fabHeight+16}px`);      
    }, 0);
  }

  ngOnDestroy(): void {
    this.contentRef.nativeElement.removeEventListener('scroll', this.onScroll);
  }
}
