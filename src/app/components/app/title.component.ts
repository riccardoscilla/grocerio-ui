import { AfterContentInit, Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-title',
  template: `
    <app-container [height]="'60px'">
      <app-row [padding]="'8px 16px'">
        <p-button
          *ngIf="back"
          icon="pi pi-arrow-left"
          [rounded]="true"
          [text]="!onPrimary"
          (click)="goBack()"
        />

        <div #fullflex class="title">
          {{ getTitle() }}
        </div>

        <div>
          <p-button *ngIf="search" icon="pi pi-search" [rounded]="true" [text]="!onPrimary" />
          <p-button
            *ngIf="menu"
            #ellipsisBtn
            icon="pi pi-ellipsis-v"
            [rounded]="true"
            (click)="ellipsisMenu.toggle($event)"
          />
          <p-overlayPanel #ellipsisMenu appendTo="body">
            <app-container>
              <p-button label="Delete" icon="pi pi-trash" [outlined]="true" />
            </app-container>
          </p-overlayPanel>
        </div>
      </app-row>
    </app-container>
  `,
  styles: [
    `
      :host {
        width: 100%;
        // height: 60px;
        // padding: 8px 16px;

        // display: flex;
        // align-items: center;
        // justify-content: space-between;
      }
      .title {
        font-size: 28px;
        font-weight: 500;
      }

      ::ng-deep .p-overlaypanel {
        left: auto !important; /* override default shift */
        right: 0 !important; /* align to the right edge of button */
        // transform: none !important; /* prevent auto positioning */
        // z-index: 1000;
      }

      ::ng-deep .p-overlaypanel:before,
      ::ng-deep .p-overlaypanel:after {
        display: none !important;
      }
    `,
  ],
})
export class TitleComponent implements AfterContentInit {
  @Input() title?: string;
  @Input() defaultTitle: string;
  @Input() onPrimary: boolean = false;
  @Input() back: string;
  @Input() search: boolean = false;
  @Input() menu: boolean = false;

  constructor(private router: Router, private hostRef: ElementRef, private renderer: Renderer2) {}

  ngAfterContentInit() {
    if (this.onPrimary) {
      this.renderer.setStyle(this.hostRef.nativeElement, 'color', 'var(--primary-text-color)');
    }
  }

  goBack() {
    this.router.navigateByUrl(this.back);
  }

  getTitle() {
    if (this.title) return this.title;
    return this.defaultTitle;
  }

  items: MenuItem[] = [
    {
      label: 'Update',
      command: () => {},
    },
    {
      label: 'Delete',
      command: () => {},
    },
  ];
}
