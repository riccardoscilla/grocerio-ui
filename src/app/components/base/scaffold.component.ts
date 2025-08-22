import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-scaffold',
  template: `
    <div class="scaffold-appbar">
      <ng-content select="[appbar]"></ng-content>
    </div>

    <div #contentContainer class="scaffold-content">
      <div #refresh class="refresh-icon">
        <div #refreshIcon style="display: flex;">
          <app-svg [path]="'rotate-right.svg'" [size]="20"></app-svg>
        </div>
      </div>
      
      <ng-content select="[content]"></ng-content>

      <div style="height: 48px;"></div>
    </div>
    
    <div class="scaffold-bottomtabbar">
      <ng-content select="[bottomtabbar]"></ng-content>
      
      <div #fabContainer class="scaffold-fab" *ngIf="showFab">
        <ng-content select="[fab]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100svh;
      width: 100%;
    }

    .scaffold-appbar {
      z-index: 10;
    }
    
    .scaffold-content {
      flex: 1;
      overflow-y: auto;
      position: relative;
      background-color: var(--background-color);
    }

    .scaffold-content .refresh-icon {
      display: flex;
      position: absolute; 
      top: -50px; 
      z-index: 10;
      left: 50%; 
      transform: translateX(-50%);
      padding: 8px;
      border-radius: 50%;
      background-color: var(--background-color);
      border: 1px solid var(--background-border-color);
    }

    .scaffold-bottomtabbar {
      position: relative;
    }

    .scaffold-fab {
      position: absolute;
      right: 16px;
    }
  `]
})
export class ScaffoldComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contentContainer') contentRef!: ElementRef<HTMLDivElement>;
  @ViewChild('fabContainer') fabRef!: ElementRef<HTMLDivElement>;
  @ViewChild('refresh') refreshRef!: ElementRef<HTMLDivElement>;
  @ViewChild('refreshIcon') refreshIconRef!: any;

  @Input() refresh: boolean = true;

  @Output() onRefresh = new EventEmitter<void>();
  
  showFab = true;

  ngAfterViewInit() {
    this.initScroll();
    this.setFabHeight();
    if (this.refresh)
      this.initPullToRefresh();
  }

  initScroll() {
    const content = this.contentRef?.nativeElement;
    let lastScrollTop = 0;

    const onScroll = () => {
      const scrollTop = content.scrollTop;
      
      if (scrollTop < lastScrollTop) {
        this.showFab = true;
        this.setFabHeight();
      } else if (scrollTop > 10) {
        this.showFab = false;
      }
      lastScrollTop = scrollTop;
    };

    content.addEventListener('scroll', onScroll);
  }

  setFabHeight() {
    setTimeout(() => {
      const fab = this.fabRef.nativeElement;
      fab.style.top = `-${fab.offsetHeight + 16}px`;
    }, 0);
  }

  initPullToRefresh() {
    const content = this.contentRef?.nativeElement;

    let startY = 0;
    let currentY = 0;
    let deltaY = 0;
    let applyPullToRefresh = false
    
    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      if (content.scrollTop !== 0) 
        return;
      applyPullToRefresh = true;
      startY = ('touches' in e) ? e.touches[0].clientY : e.clientY;
      currentY = startY;
      deltaY = 0;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onMouseMove);
      document.addEventListener('touchend', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if(!applyPullToRefresh) return;
      const refresh = this.refreshRef.nativeElement;
      const refreshIcon = this.refreshIconRef.nativeElement;
      currentY = ('touches' in e) ? e.touches[0].clientY : e.clientY;
      deltaY = Math.min(currentY - startY, 100);
      if (deltaY < -50)
        return;

      const rotationDeg = (deltaY * 270 / 100);
      refresh.style.top = `${-50 + deltaY}px`;   
      refreshIcon.style.transform = `rotate(${rotationDeg}deg)`;
    };

    const onMouseUp = () => {
      if(!applyPullToRefresh) return;
      applyPullToRefresh = false;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('touchend', onMouseUp);

      const refresh = this.refreshRef.nativeElement;
      refresh.style.top = `${-50}px`;

      if (deltaY === 100) {
        this.onRefresh.emit();
      }
    };

    content.addEventListener('mousedown', onMouseDown);
    content.addEventListener('touchstart', onMouseDown);
  }

  ngOnDestroy(): void {
    // this.contentRef.nativeElement.removeEventListener('scroll', this.onScroll);
  }
}
