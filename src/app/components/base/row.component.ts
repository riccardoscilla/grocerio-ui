import {
  Component,
  ContentChildren,
  Input,
  QueryList,
  AfterContentInit,
  Renderer2,
  ElementRef,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-row',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div *ngIf="label">{{ label }}</div>
    <div class="row-content" #content><ng-content></ng-content></div>
  `,
  styles: `
    app-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }

    .row-content {
      display: flex;
      width: 100%;
      height: 100%;
      gap: 8px;
      align-items: center;
      position: relative;
    }
    .p-flex {
      flex: 1;
    }
    p-button.p-flex button,
    p-autocomplete.p-flex div,
    p-dropdown.p-flex > div:first-child,
    p-calendar.p-flex span,
    p-password.p-flex div,
    p-password.p-flex div input,
    p-iconfield.p-flex input {
      width: 100%;
    }
  `,
})
export class RowComponent implements AfterContentInit {
  @Input() padding = '';
  @Input() height = '';
  @Input() center = false;
  @Input() reverse = false;
  @Input() label = '';

  @ViewChild('content', { static: true }) content!: ElementRef;
  @ContentChildren('fullflex', { descendants: true, read: ElementRef })
  fullflexItems!: QueryList<ElementRef>;

  constructor(private hostRef: ElementRef, private renderer: Renderer2) {}

  ngAfterContentInit() {
    this.fullflexItems.forEach((item) =>
      this.renderer.addClass(item.nativeElement, 'p-flex')
    );
    if (this.padding)
      this.renderer.setStyle(this.hostRef.nativeElement, 'padding', this.padding);
    if (this.height)
      this.renderer.setStyle(this.hostRef.nativeElement, 'height', this.height);
    if (this.center)
      this.renderer.setStyle(this.content.nativeElement, 'justify-content', 'center');
    if (this.reverse)
      this.renderer.setStyle(this.content.nativeElement, 'flex-direction', 'row-reverse');
  }
}
