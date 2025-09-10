import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2, ViewChild } from '@angular/core';
import { GestureUtils } from '../utils/GestureUtils';

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

    </div>
    
    <!-- <div style="height: 47px;"></div> -->
    <div class="scaffold-bottomtabbar">
      <ng-content select="[bottomtabbar]"></ng-content>
      
      <div #fabContainer class="scaffold-fab" *ngIf="showFab">
        <ng-content select="[fab2]"></ng-content>
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
      background-color: var(--bg-base);
    }
    
    .scaffold-content {
      flex: 1;
      overflow-y: scroll;
      // -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        display: none;
      }
      -ms-overflow-style: none;  /* For Internet Explorer and Edge */
      scrollbar-width: none;    /* For Firefox */

      position: relative;
      background-color: var(--bg-base);

      padding-bottom: 96px;
      box-sizing: border-box;
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
      background-color: var(--bg-surface);
      border: 1px solid var(--border);
    }

    .scaffold-bottomtabbar {
      position: absolute;
      // overflow: hidden;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .scaffold-fab {
      position: absolute;
      right: 16px;

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
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
    const refresh = this.refreshRef.nativeElement;
    const refreshIcon = this.refreshIconRef.nativeElement;
    const gestureId = GestureUtils.getGestureId();

    let startX = 0;
    let startY = 0;
    let currentY = 0;
    let deltaY = 0;
    let applyPullToRefresh = false;
    let invalidPullToRefresh = false;
    
    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      if (content.scrollTop !== 0) return; // only if on top of page

      applyPullToRefresh = true;
      invalidPullToRefresh = false;
      startX = GestureUtils.getX(e);
      startY = GestureUtils.getY(e);
      currentY = startY;
      deltaY = 0;

      content.addEventListener('mousemove', onMouseMove);
      content.addEventListener('mouseup', onMouseUp);
      content.addEventListener('touchmove', onMouseMove);
      content.addEventListener('touchend', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if(!applyPullToRefresh) return;
      if(invalidPullToRefresh) return;
      
      if (!GestureUtils.lock && GestureUtils.isVerticalDrag(e, startX, startY)) {
        GestureUtils.lock = gestureId;
      }
      if (!GestureUtils.lock) return;
      if (GestureUtils.lock && GestureUtils.lock != gestureId) return;

      currentY = GestureUtils.getY(e);
      deltaY = GestureUtils.clamp(currentY - startY, -50, 100);
      if (deltaY === -50) {
        invalidPullToRefresh = true;
        return;
      }
      
      const rotationDeg = (deltaY * 270 / 100);
      refresh.style.top = `${-50 + deltaY}px`;   
      refreshIcon.style.transform = `rotate(${rotationDeg}deg)`;
    };

    const onMouseUp = () => {
      if(!applyPullToRefresh) return;
      if (GestureUtils.lock != gestureId) return;
      applyPullToRefresh = false;
      GestureUtils.lock = null;

      content.removeEventListener('mousemove', onMouseMove);
      content.removeEventListener('mouseup', onMouseUp);
      content.removeEventListener('touchmove', onMouseMove);
      content.removeEventListener('touchend', onMouseUp);

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
