import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CheckboxChangeEvent } from 'primeng/checkbox';

@Component({
  selector: 'app-list-item-tile',
  template: `
    <div class="list-item-tile item" 
      [class.height2]="secondaryText !== undefined"
      [class.padding-right]="checkBox == true"

      (panstart)="onPanStart($event)"
      (panmove)="onPanMove($event)"
      (panend)="onPanEnd()"
    >

      <div *ngIf="checkBox" style="padding-left: -16px;">
        <p-checkbox (onChange)="onCheckChange($event)" [binary]="true" variant="filled" />
      </div>

      <div class="leading-icons">
        <span class="icon">
          {{ leadingIcon!!.icon }}
        </span>
      </div>

      <div class="content" (click)="onEdit()">
        <div class="main-text">{{ mainText }}</div>
        <div class="secondary-text">{{ secondaryText }}</div>
      </div>

      <div class="text-right" *ngIf="rightText && currentWidth === 0">
        {{ rightText }}
      </div>

      <!-- Action Buttons (slidable area) -->
      <div class="actions" [style.opacity]="actionOpacity" [style.width]="actionWidth" *ngIf="currentWidth > 0">
          <p-button [text]="true" (click)="onEdit()">
            <ng-template pTemplate="icon">
              <app-svg [color]="'black'" [size]="18" [path]="'file-edit.svg'"></app-svg>
            </ng-template>
          </p-button>
          <p-button [text]="true" (click)="onDelete()">
            <ng-template pTemplate="icon">
              <app-svg [color]="'black'" [size]="18" [path]="'trash-xmark.svg'"></app-svg>
            </ng-template>
          </p-button>
      </div>

    </div>
  `,
  styles: [`

    .list-item-tile {
      height: 48px;
      padding-left: 8px;

      touch-action: pan-y !important; // allow scroll when click on pan element

      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;

      &.height2 {
        height: 56px;
      }

      &.padding-right {
        // padding: 0 16px;
      }
    }

    .icon {
      font-size: 20px;
    }

    .content {
      flex: 1;
      display: flex;  
      flex-direction: column;
      gap: 2px;
    }
    .secondary-text {
      font-size: 14px;
      font-weight: 300;
    }

    .text-right {
      padding-right: 8px;
    }

    .actions {
      overflow-x: hidden;

      display: flex;
      align-items: center;
      // gap: 8px;

      padding-right: -8px;
      
      transition: opacity 0.3s ease;
    }
  `]
})
export class ListItemTileComponent {
  @Input() leadingIcon: { icon: string; } | undefined
  @Input() mainText: string;
  @Input() secondaryText: string | undefined;
  @Input() rightText: string | undefined;
  @Input() checkBox: boolean = false
  @Output() check = new EventEmitter<void>();
  @Output() uncheck = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  public maxWidth = 80; // Max distance to slide before fully revealing actions
  public panStartX = 0;
  public currentWidth = 0; // Track the current slide distance
  public actionWidth = '0';
  public actionOpacity = 0;

  public panningRTL = false;

  constructor(private elementRef: ElementRef) {}

  onCheckChange($event: CheckboxChangeEvent) {
    if ($event.checked === true) 
      this.check.emit()
    else 
      this.uncheck.emit()
  }

  onEdit() {
    this.resetSlide()
    this.edit.emit()
  }

  onDelete() {
    this.resetSlide()
    this.delete.emit()
  }

  // @HostListener('panstart', ['$event'])
  onPanStart(event: any) {
    this.panStartX = event.center.x
  }

  // @HostListener('panmove', ['$event'])
  onPanMove(event: any) {
    const diff = event.center.x - this.panStartX
    const distance = Math.abs(diff)

    if(distance < 20)
      return


    this.panningRTL = diff < 0

    if (this.panningRTL  && this.currentWidth < this.maxWidth) {
      this.currentWidth = Math.min(distance, this.maxWidth)
      this.actionWidth = `${this.currentWidth}px`
      this.actionOpacity = this.currentWidth / this.maxWidth
    }
    else if (!this.panningRTL  && this.currentWidth > 0) {
      this.currentWidth = this.maxWidth - Math.min(distance, this.maxWidth)
      this.actionWidth = `${this.currentWidth}px`
      this.actionOpacity = this.currentWidth / this.maxWidth
    }
  }

  pl(event: any) { 
    if (this.currentWidth >= this.maxWidth)
      return
    this.currentWidth = Math.min(event.distance, this.maxWidth)
    this.actionWidth = `${this.currentWidth}px`
    this.actionOpacity = this.currentWidth / this.maxWidth
  }

  pr(event: any) {
    if (this.currentWidth === 0)
      return
    this.currentWidth = this.maxWidth - Math.min(event.distance, this.maxWidth)
    this.actionWidth = `${this.currentWidth}px`
    this.actionOpacity = this.currentWidth / this.maxWidth
  }

  // @HostListener('panend')
  onPanEnd() {
    if (this.panningRTL) {
      if (Math.abs(this.currentWidth) < this.maxWidth / 2) {
        this.resetSlide()
      } else {
        this.completeSlide()
      }
    }
    else {
      if (Math.abs(this.currentWidth) < this.maxWidth / 2) {
        this.resetSlide()
      } else {
        this.completeSlide()
      }
    }    
  }

  // Close sliding when clicking outside the component
  @HostListener('document:mousedown', ['$event.target'])
  onClickOutside(targetElement: HTMLElement) {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement)
    if (!clickedInside) {
      this.resetSlide()
    }
  }

  private resetSlide() {
    this.actionWidth = '0'
    this.actionOpacity = 0
    this.currentWidth = 0 
  }

  private completeSlide() {
    this.actionWidth = `${this.maxWidth}px`
    this.actionOpacity = 1
    this.currentWidth = this.maxWidth 
  }

}
