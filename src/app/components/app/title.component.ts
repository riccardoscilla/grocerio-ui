import { AfterContentInit, Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-title',
  template: `
    <app-container [height]="'60px'">
      <app-row [padding]="'8px 16px'">
        <app-button *ngIf="back" variant="text" icon="arrow-small-left.svg" iconSize="24" (onClick)="goBack()" />
        <div #fullflex class="title"> {{ getTitle() }}</div>
      </app-row>
    </app-container>
  `,
  styles: [
    `
      :host {
        width: 100%;
      }

      .title {
        font-size: 1.5rem;
        font-weight: 500;
      }
    `,
  ],
})
export class TitleComponent implements AfterContentInit {
  @Input() title?: string;
  @Input() defaultTitle: string;
  @Input() onPrimary: boolean = false;
  @Input() back: string;

  constructor(private router: Router, private hostRef: ElementRef, private renderer: Renderer2) {}

  ngAfterContentInit() {
    if (this.onPrimary) {
      this.renderer.setStyle(this.hostRef.nativeElement, 'color', 'var(--primary-text)');
    }
  }

  goBack() {
    this.router.navigateByUrl(this.back);
  }

  getTitle() {
    if (this.title) return this.title;
    return this.defaultTitle;
  }
}
