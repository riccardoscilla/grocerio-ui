import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CheckboxChangeEvent } from 'primeng/checkbox';

@Component({
  selector: 'app-list-item',
  template: `
    <app-row [padding]="'0'">
      <p-checkbox
        *ngIf="showCheckbox"
        [(ngModel)]="checked"
        (onChange)="onCheckChange($event)"
        [binary]="true"
      />

      <app-category-icon *ngIf="icon" [icon]="icon" [favourite]="favourite" />

      <div #fullflex #longpress (click)="onClick()">{{ contentText }}</div>

      <div *ngIf="rightText">{{ rightText }}</div>

      <p-button
        *ngIf="deleteButton"
        icon="pi pi-trash"
        [rounded]="true"
        severity="danger"
        [text]="true"
        (click)="delete.emit()"
      />

      <p-button
        *ngIf="angleRightButton && url"
        [text]="true"
        [rounded]="true"
        (click)="goTo()"
      >
        <ng-template pTemplate="icon">
          <app-svg
            [color]="'black'"
            [size]="18"
            [path]="'angle-small-right.svg'"
          ></app-svg>
        </ng-template>
      </p-button>
    </app-row>
  `,
  styles: `
    :host {
      height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
  `,
})
export class ListItemComponent implements AfterViewInit{
  @Input() icon: string;
  @Input() favourite: boolean;
  @Input() contentText: string;
  @Input() rightText: string;
  @Input() deleteButton: boolean;
  @Input() angleRightButton: boolean;
  @Input() url: string;

  @Input() showCheckbox: boolean = false;
  @Input() checked: boolean = false;
  @Output() check = new EventEmitter<boolean>();

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  @ViewChild('longpress') divRef!: any;
  longPressActive: boolean = false;

  constructor(
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    const divEl: HTMLElement = this.divRef?.nativeElement;
    if (!divEl) return;

    let longPressTimer: any;
    
    const onMouseDown = (e: MouseEvent | TouchEvent) => {     
      this.longPressActive = false;
      
      longPressTimer = setTimeout(() => {
        console.log('🎯 Long press detected');
        this.longPressActive = true;
      }, 500);
    };

    const onMouseUp = (e: MouseEvent | TouchEvent) => {
      clearTimeout(longPressTimer);
    };

    divEl.addEventListener('mousedown', onMouseDown);
    divEl.addEventListener('touchstart', onMouseDown);
    divEl.addEventListener('mouseup', onMouseUp);
    divEl.addEventListener('touchend', onMouseUp);
  }

  onClick() {
    if (this.longPressActive)
      return;
    this.edit.emit();
  } 

  onCheckChange($event: CheckboxChangeEvent) {
    $event.checked === true ? this.check.emit(true) : this.check.emit(false);
  }

  goTo() {
    this.router.navigateByUrl(this.url);
  }
}
