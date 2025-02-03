import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CheckboxChangeEvent } from 'primeng/checkbox';

@Component({
  selector: 'app-list-item',
  template: `
    <div class="list-item item" 
      [class.height2]="secondaryText !== undefined"
      [class.padding-right]="checkBox == true"
    >

      <div *ngIf="checkBox" style="padding-left: -16px;">
        <p-checkbox [(ngModel)]="checked" (onChange)="onCheckChange($event)" [binary]="true" variant="filled" />
      </div>

      <div class="leading-icons">
        <span class="icon" >
          {{ leadingIcon!!.icon }}
        </span>
        <div class="fav-icon">
          <app-svg *ngIf="favIcon"  [color]="'black'" [size]="14" [path]="'circle-heart.svg'"></app-svg>
        </div>

      </div>

      <div class="content" (click)="edit.emit()">
        <div class="main-text">{{ mainText }}</div>
        <div class="secondary-text">{{ secondaryText }}</div>
      </div>

      <div class="text-right">
        <app-svg *ngIf="notesIcon" [color]="'black'" [size]="16" [path]="'memo.svg'"></app-svg>
        <span *ngIf="rightText">{{ rightText }}</span>
      </div>
    </div>
  `,
  styles: [`

    .list-item {
      height: 48px;
      padding-left: 8px;

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

    .leading-icons {
      width: 28px;
      display: flex;
      justify-content: center;

      position: relative;
    }

    .icon {
      font-size: 20px;
    }

    .fav-icon {
      position: absolute; 
      display: flex; 
      bottom: -4px; 
      right: -4px;
      background-color: white;
      border-radius: 50%;
      padding: 0.7px;
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
      display: flex;
      gap: 8px;
      align-items: center;
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
export class ListItemComponent {
  @Input() leadingIcon: { icon: string; } | undefined
  @Input() mainText: string;
  @Input() secondaryText: string | undefined;
  @Input() rightText: string | undefined;
  @Input() checkBox: boolean = false
  @Input() notesIcon: boolean = false
  @Input() favIcon: boolean = false;
  @Input() checked: boolean = false
  @Output() check = new EventEmitter<void>();
  @Output() uncheck = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

  onCheckChange($event: CheckboxChangeEvent) {
    if ($event.checked === true) 
      this.check.emit()
    else 
      this.uncheck.emit()
  }
}
