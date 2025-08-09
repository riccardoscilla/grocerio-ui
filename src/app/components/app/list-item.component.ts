import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CheckboxChangeEvent } from 'primeng/checkbox';

@Component({
  selector: 'app-list-item',
  template: `
    <app-row [padding]="'0'">
      <app-category-icon *ngIf="icon" [icon]="icon" [favourite]="favourite" />
      
      <div #fullflex (click)="onClick()">{{ contentText }}</div>
      
      <p-checkbox *ngIf="showCheckbox" [(ngModel)]="checked" (onChange)="onCheckChange($event)" [binary]="true"/>
      
      <div *ngIf="rightText">{{ rightText }}</div>

      <p-button *ngIf="deleteButton" icon="pi pi-trash" [rounded]="true" severity="danger" [text]="true" (click)="delete.emit()"/>

      <p-button *ngIf="angleRightButton && url" [text]="true" [rounded]="true" (click)="goTo()">
        <ng-template pTemplate="icon">
          <app-svg [color]="'black'" [size]="18" [path]="'angle-small-right.svg'"></app-svg>
        </ng-template>
      </p-button>
    </app-row>
  `,
  styles: `
    :host {
      height: 52px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
  `,
})
export class ListItemComponent {
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

  constructor(
    private router: Router
  ) {}

  onClick() {
    this.edit.emit();
  } 

  onCheckChange($event: CheckboxChangeEvent) {
    $event.checked === true ? this.check.emit(true) : this.check.emit(false);
  }

  goTo() {
    this.router.navigateByUrl(this.url);
  }
}
