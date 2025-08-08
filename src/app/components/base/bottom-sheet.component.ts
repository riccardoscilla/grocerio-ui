import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-bottom-sheet',
  template: `
    <p-dialog
      #dialog
      (onShow)="initDragSmooth()"
      [(visible)]="visible"
      [draggable]="false"
      [resizable]="false"
      [modal]="true"
      [closable]="true"
      [dismissableMask]="true"
      position="bottom"
      (onHide)="visibleChange.emit(false)"
      class="bottom-sheet"
    >
      <ng-template pTemplate="header">
        
        <div class="dialog-header">
          {{header}}
          <div class="drag-bar" (click)="visibleChange.emit(false)"></div>
        </div>
      </ng-template>

      <ng-content select="[content]"></ng-content>

      <ng-template pTemplate="footer">
        <ng-content select="[footer]"></ng-content>
      </ng-template>
    </p-dialog>    
  `,
  styles: [`
    .bottom-sheet .dialog-header {
      font-weight: 600;
      font-size: 1.25rem;
      position: relative;
      width: 100%;
    }
    
    .bottom-sheet .drag-bar {
      position: absolute; 
      top: -15px; 
      left: 50%; 
      transform: translateX(-50%); 
      width: 30%; 
      height: 3px; 
      background-color: var(--background-text-color);
    }
    

    ::ng-deep .bottom-sheet .p-dialog {
      width: 100vw;
      height: calc(100dvh - 60px);
      border-radius: 12px 12px 0px 0px;
      margin: 0;
      max-height: none;
    }

    ::ng-deep .bottom-sheet > .p-dialog-mask {
      // backdrop-filter: blur(1px);
      background-color: rgba(0, 0, 0, 0.2) !important;

    }

    ::ng-deep .bottom-sheet .p-dialog-header-icons {
      display: none;
    }
    
    @media (min-width: 500px) { 
      ::ng-deep .bottom-sheet .p-dialog {
        width: 500px;
      }
    }
  `]
})
export class BottomSheetComponent {
  @Input() visible: boolean;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() header: string;

  @ViewChild('dialog') dialogRef!: any;

  initDrag() {
    const dialogEl: HTMLElement = this.dialogRef?.el?.nativeElement;
    if (!dialogEl) return;
    
    const header = dialogEl.querySelector('.p-dialog-header') as HTMLElement;
    if (!header) return;

    const dialogPanel = dialogEl.querySelector('.p-dialog') as HTMLElement;
    if (!dialogPanel) return;

    let startY = 0;
    let currentY = 0;
    let dialogPanelHeight = dialogPanel.offsetHeight;
    let dragging = false;

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      (document.activeElement as HTMLElement)?.blur();

      dragging = true;
      startY = ('touches' in e) ? e.touches[0].clientY : e.clientY;
      currentY = startY
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onMouseMove);
      document.addEventListener('touchend', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;

      currentY = ('touches' in e) ? e.touches[0].clientY : e.clientY;
      const deltaY = currentY - startY;
      if (deltaY > 0) {
        dialogPanel.style.transform = `translateY(${deltaY}px)`
      }
    };

    const onMouseUp = () => {
      if (!dragging) return;
      dragging = false;

      const deltaY = currentY - startY;      
      if (deltaY > dialogPanelHeight * 0.3) {
        this.visibleChange.emit(false)
      }
      else {
        dialogPanel.style.transform = ``
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('touchend', onMouseUp);
    };

    header.addEventListener('mousedown', onMouseDown);
    header.addEventListener('touchstart', onMouseDown);
  }

  initDragSmooth() {
    const dialogEl: HTMLElement = this.dialogRef?.el?.nativeElement;
    if (!dialogEl) return;

    const header = dialogEl.querySelector('.p-dialog-header') as HTMLElement;
    if (!header) return;

    const dialogPanel = dialogEl.querySelector('.p-dialog') as HTMLElement;
    if (!dialogPanel) return;
    
    this.applyNoPullToRefreshStyles()

    let startY = 0;
    let currentY = 0;
    let deltaY = 0;
    let dragging = false;
    let animationFrameId: number;

    const setTransform = (y: number) => {
      dialogPanel.style.transform = `translateY(${y}px)`;
    };

    const animate = () => {
      setTransform(deltaY);
      animationFrameId = requestAnimationFrame(animate);
    };      

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      (document.activeElement as HTMLElement)?.blur();

      dragging = true;
      startY = ('touches' in e) ? e.touches[0].clientY : e.clientY;
      currentY = startY;
      dialogPanel.style.transition = 'none'; // remove transition during drag
      dialogPanel.style.willChange = 'transform';

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onMouseMove);
      document.addEventListener('touchend', onMouseUp);

      animate();
    };

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      currentY = ('touches' in e) ? e.touches[0].clientY : e.clientY;
      deltaY = Math.max(0, currentY - startY);

      // if ('touches' in e && deltaY > 0) {
      //   e.preventDefault();
      // }
    };

    const onMouseUp = () => {
      if (!dragging) return;
      dragging = false;
      cancelAnimationFrame(animationFrameId);

      const dialogPanelHeight = dialogPanel.offsetHeight;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('touchend', onMouseUp);

      if (deltaY > dialogPanelHeight * 0.3) {
        this.resetPullToRefreshStyle();
        this.visibleChange.emit(false);
      } else {
        dialogPanel.style.transition = 'transform 0.2s ease-out';
        dialogPanel.style.willChange = '';
        setTransform(0);
      }

      deltaY = 0;
    };

    header.addEventListener('mousedown', onMouseDown);
    header.addEventListener('touchstart', onMouseDown);
  }

  applyNoPullToRefreshStyles() {
    document.documentElement.style.overscrollBehaviorY = 'contain';
    document.documentElement.style.touchAction = 'pan-x';
    document.body.style.overscrollBehaviorY = 'contain';
    document.body.style.touchAction = 'pan-x';
  }

  resetPullToRefreshStyle() {
    document.documentElement.style.overscrollBehaviorY = '';
    document.documentElement.style.touchAction = '';
    document.body.style.overscrollBehaviorY = '';
    document.body.style.touchAction = '';
  }
}
