import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GestureUtils } from '../utils/GestureUtils';

@Component({
  selector: 'app-bottom-sheet',
  template: `
    <div class="bottom-sheet" #bottomSheet>
        
      <div class="bottom-sheet-header" #dragZone>
        <div class="drag-bar"></div>
        {{header}}
      </div>

      <div #fullflex class="bottom-sheet-content">
        <ng-content select="[content]"></ng-content>
      </div>
      
      <div class="bottom-sheet-footer">
        <ng-content select="[footer]"></ng-content>
      </div>
      
    </div>
  `,
  styles: [`
    :host {
      background-color: rgba(0, 0, 0, 0.2);
      position: fixed;
      inset: 0;
      z-index: 1000;
      width: 100%;

      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 16px;  
    }

    .bottom-sheet {
      background-color: var(--bg-surface);
      width: 100%;
      height: calc(100svh - 60px);
      display: flex;
      flex-direction: column;
      gap: 0;
      border-radius: 12px 12px 0px 0px;
      transform: translateY(100%);
    }

    .bottom-sheet-header {
      font-weight: 600;
      font-size: 1.25rem;
      position: relative;
      padding: 32px 16px 16px 16px;
    }
    
    .bottom-sheet-header .drag-bar {
      position: absolute; 
      top: 14px; 
      left: 50%; 
      transform: translateX(-50%); 
      width: 20%; 
      height: 4px; 
      border-radius: 4px;
      background-color: var(--border);
    }

    .bottom-sheet-content {
      padding: 0 16px;
      flex: 1;
      overflow-y: auto;
    }

    .bottom-sheet-footer {
      padding: 16px;
    }
    
    @media (min-width: 500px) { 
      .bottom-sheet {
        width: 500px;
      }
    }
  `]
})
export class BottomSheetComponent implements OnChanges {
  @Input() header: string;
  @Input() visible: boolean;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('bottomSheet', { static: false }) bottomSheetRef!: ElementRef<HTMLDivElement>;
  @ViewChild('dragZone') dragZoneRef!: ElementRef<HTMLDivElement>;

  sheetOpen = false;

  ngOnChanges() {
    if (this.visible) {
      GestureUtils.onStable(() => {
        this.openSheet();
        this.initDrag();
        this.initClickOutside();
      });
    }
  }

  openSheet() {
    const sheet = this.bottomSheetRef?.nativeElement;
    if (!sheet) return;   
    
    const onTransitionEnd = () => {
      sheet.removeEventListener('transitionend', onTransitionEnd);
      this.sheetOpen = true;
    };

    sheet.addEventListener('transitionend', onTransitionEnd);

    requestAnimationFrame(() => {
      sheet.style.transition = 'transform 0.2s ease-out';
      sheet.style.transform = 'translateY(0)';
    })
  }

  closeSheet() {
    const sheet = this.bottomSheetRef?.nativeElement;
    if (!sheet) return;    

    const onTransitionEnd = () => {
      sheet.removeEventListener('transitionend', onTransitionEnd);
      this.closed.emit();
    };

    sheet.addEventListener('transitionend', onTransitionEnd);

    requestAnimationFrame(() => {
      sheet.style.transition = 'transform 0.1s ease-out';
      sheet.style.transform = 'translateY(100%)';
    });
  }

  initDrag() {
    const sheet = this.bottomSheetRef?.nativeElement;
    if (!sheet) return;
    
    const dragZone = this.dragZoneRef?.nativeElement;
    if (!dragZone) return;

    let startY = 0;
    let currentY = 0;
    let deltaY = 0;
    let dragging = false;

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      (document.activeElement as HTMLElement)?.blur();

      dragging = true;
      startY = GestureUtils.getY(e);
      currentY = startY;
      sheet.style.transition = '';

      sheet.addEventListener('mousemove', onMouseMove);
      sheet.addEventListener('mouseup', onMouseUp);
      sheet.addEventListener('touchmove', onMouseMove);
      sheet.addEventListener('touchend', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      currentY = GestureUtils.getY(e);
      deltaY = Math.max(0, currentY - startY);
      sheet.style.transform = `translateY(${deltaY}px)`;
    };

    const onMouseUp = () => {
      if (!dragging) return;
      dragging = false;

      sheet.removeEventListener('mousemove', onMouseMove);
      sheet.removeEventListener('mouseup', onMouseUp);
      sheet.removeEventListener('touchmove', onMouseMove);
      sheet.removeEventListener('touchend', onMouseUp);

      if (deltaY > sheet.offsetHeight * 0.15) {
        dragZone.removeEventListener('mousedown', onMouseDown);
        dragZone.removeEventListener('touchstart', onMouseDown);
        this.closeSheet();
      } else {
        deltaY = 0;
        this.openSheet();
      }
    };

    dragZone.addEventListener('mousedown', onMouseDown);
    dragZone.addEventListener('touchstart', onMouseDown);
  }

  initClickOutside() {
    const sheet = this.bottomSheetRef?.nativeElement;

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      if (!this.sheetOpen) return;
      if (!sheet.contains(e.target as Node)) {
        this.closeSheet();
      }
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('touchstart', onMouseDown);
  }
}
