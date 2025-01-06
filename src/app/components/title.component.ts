import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-title',
  template: `
    <div class="content">
        <div class="side" *ngIf="back">
            <p-button [text]="true" [rounded]="true" (click)="goBack()">
                <ng-template pTemplate="icon">
                    <app-svg [color]="'white'" [size]="24" [path]="'arrow-small-left.svg'"></app-svg>
                </ng-template>
            </p-button>
        </div>

        <div class="title" [ngClass]="{'main-title': !back}">
            {{title}}
        </div>

        <div class="side"></div> 
    </div>
  `,
  styles: [`
    .content {
        position: relative;
        padding: 8px; 
        
        display: flex; 
        align-items: center; 
        justify-content: space-between;

        background-color: var(--primary-color);
    }
    .title {
        font-size: 24px; 
        font-weight: 500; 
        text-align: center;

        color: var(--primary-color-text);

        &.main-title {
            padding-left: 16px;
            font-size: 32px; 
        }
    }
    .side {
        width: 48px;
    }

    .content::before {
        content: "";
        position: absolute;
        background-color: transparent;
        bottom: -32px;
        left: 0;
        height: 32px;
        width: 16px;
        border-top-left-radius: 16px;
        box-shadow: 0 -16px 0 0 var(--primary-color);
    }

    .content::after {
        content: "";
        position: absolute;
        background-color: transparent;
        bottom: -32px;
        right: 0;
        height: 32px;
        width: 16px;
        border-top-right-radius: 16px;
        box-shadow: 0 -16px 0 0 var(--primary-color);
    }
  `]
})
export class TitleComponent {
    @Input() title: string;
    @Input() back: string;

    constructor(
        private router: Router
    ) {}
    

    goBack() {
        this.router.navigateByUrl(this.back);
    }
}
