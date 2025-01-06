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
        height: 64px; 
        padding: 0 8px; 
        
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
