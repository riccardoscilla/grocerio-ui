import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { GestureUtils } from '../utils/GestureUtils';

@Component({
  selector: 'app-list-tile',
  template: `
    <app-row #tile padding="0 8px" height="56px" >
      <!-- <div #dragBox class="drag-box"></div> -->

      <ng-content select="[leading]"></ng-content>

      <div class="list-tile-content-container" #fullflex>
        <div class="list-tile-content">
          <ng-content select="[content]"></ng-content>
        </div>
        
        <ng-content select="[subcontent]"></ng-content>
      </div>
      
      <ng-content select="[trailing]"></ng-content>
    </app-row>
  `,
  styles: [`
    :host {
      app-row {
        border-radius: 8px;
        &:active {
          background-color: var(--background-highlight-color);
        }
      }
    }

    .list-tile-content-container {
      height: 100%;
      display: flex;
      flex-direction: column;    
      justify-content: center;
      gap: 4px;
    }

    .list-tile-content {
      
    }

    .list-tile-subcontent {
      font-size: 14px;
      font-weight: 200;
    }

    :host ::ng-deep [subcontent] {
      font-size: 14px;
      font-weight: 200;
    }
  `]
})
export class ListTileComponent implements AfterViewInit {
  @ViewChild('tile', { read: ElementRef }) tileRef!: ElementRef<HTMLElement>;
  @ViewChild('dragBox') dragBoxRef!: ElementRef<HTMLDivElement>;

  @Output() onClick = new EventEmitter<void>();
  @Output() onLongPress = new EventEmitter<void>();

  ngAfterViewInit() {
    // this.initDrag();
    // this.initClickOutside();
    this.initClick();
  }

  initClick() {
    const tile = this.tileRef?.nativeElement;
    
    let clickTime = 0;
    let clickX = 0;
    let clickY = 0;
    let clicking = false;
    let target: EventTarget | null = null;

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      clicking = true;
      clickTime = GestureUtils.getTimestamp(e);
      clickX = GestureUtils.getX(e);
      clickY = GestureUtils.getY(e);

      tile.addEventListener('mouseup', onMouseUp);
      tile.addEventListener('touchend', onMouseUp);
    };

    const onMouseUp = (e: MouseEvent | TouchEvent) => {
      if(!clicking) return;
      clicking = false;

      const samePosition = clickX === GestureUtils.getX(e) && clickY === GestureUtils.getY(e);
      
      if (samePosition) {
        const diffTime = GestureUtils.getTimestamp(e) - clickTime;
        if (diffTime > 500)
          this.onLongPress.emit();
        else 
          this.onClick.emit();
      }

      tile.removeEventListener('mouseup', onMouseUp);
      tile.removeEventListener('touchend', onMouseUp);
    };

    tile.addEventListener('mousedown', onMouseDown);
    tile.addEventListener('touchstart', onMouseDown);
  }

  initDrag() {
    const dragBox = this.dragBoxRef?.nativeElement;
    const tile = this.tileRef?.nativeElement;
    const gestureId = GestureUtils.getGestureId();

    let startX = 0;
    let startY = 0;
    let firstX = 0;
    let currentX = 0;
    let deltaX = 0;
    let startWidth = 0;
    let dragging = false;

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      dragging = true;
      startX = GestureUtils.getX(e);
      startY = GestureUtils.getY(e);
      currentX = startX;
      firstX = 0;
      deltaX = 0;
      startWidth = GestureUtils.getWidth(dragBox);

      tile.addEventListener('mousemove', onMouseMove);
      tile.addEventListener('mouseup', onMouseUp);
      tile.addEventListener('touchmove', onMouseMove);
      tile.addEventListener('touchend', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if(!dragging) return;
      
      if (!GestureUtils.lock && GestureUtils.isHorizontalDrag(e, startX, startY)) {
        GestureUtils.lock = gestureId;
      }
      if (!GestureUtils.lock) return;
      if (GestureUtils.lock && GestureUtils.lock != gestureId) return;

      currentX =  GestureUtils.getX(e);
      if (firstX == 0)
        firstX = currentX;

      if (startWidth == 0)
        deltaX = GestureUtils.clamp(currentX - firstX, 0, 50);
      else 
        deltaX = GestureUtils.clamp(currentX - firstX, -50, 0);

      dragBox.style.width = `${startWidth + deltaX}px`;
    };

    const onMouseUp = () => {
      if(!dragging) return;
      if (GestureUtils.lock != gestureId) return;
      dragging = false;
      GestureUtils.lock = null;

      tile.removeEventListener('mousemove', onMouseMove);
      tile.removeEventListener('mouseup', onMouseUp);
      tile.removeEventListener('touchmove', onMouseMove);
      tile.removeEventListener('touchend', onMouseUp);

      if (deltaX > 20) 
        dragBox.style.width = '50px';
      else 
        dragBox.style.width = '0';
    };

    tile.addEventListener('mousedown', onMouseDown);
    tile.addEventListener('touchstart', onMouseDown);
  }

  initClickOutside() {
    const tile = this.tileRef?.nativeElement;
    const dragBox = this.dragBoxRef?.nativeElement;

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      if (!tile.contains(e.target as Node)) {
        dragBox.style.width = '0';
      }
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('touchstart', onMouseDown);
  }
}
