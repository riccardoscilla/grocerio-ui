import {
  Component,
  ContentChildren,
  Input,
  QueryList,
  AfterContentInit,
  Renderer2,
  ElementRef,
  ViewChildren,
  ViewEncapsulation,
  HostBinding,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-row',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div *ngIf="label">{{ label }}</div>
    <div class="content" #content><ng-content></ng-content></div>
  `,
  styles: `
    app-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }

    .content {
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
    p-password.p-flex div input {
      width: 100%;
    }
    // .p-flex > div:first-child,
    // .p-flex > span:first-child,
    // .p-flex > span:first-child,
    // .p-flex > input:first-child
    // .p-flex > button:first-child {
    // .p-flex > *:first-child {
    //   width: 100%;
    // }
  `,
})
export class RowComponent implements AfterContentInit {
  @Input() padding = '';
  @Input() center = false;
  @Input() reverse = false;
  @Input() label: string;

  @ViewChild('content', { static: true }) content!: ElementRef;
  @ContentChildren('fullflex', { descendants: true, read: ElementRef })
  fullflexItems!: QueryList<ElementRef>;

  constructor(private hostRef: ElementRef, private renderer: Renderer2) {}

  ngAfterContentInit() {
    this.fullflexItems.forEach((item) =>
      this.renderer.addClass(item.nativeElement, 'p-flex')
    );
    if (this.reverse)
      this.renderer.setStyle(
        this.content.nativeElement,
        'flex-direction',
        'row-reverse'
      );
    if (this.center)
      this.renderer.setStyle(
        this.content.nativeElement,
        'justify-content',
        'center'
      );
    if (this.padding) {
      this.renderer.setStyle(
        this.hostRef.nativeElement,
        'padding',
        this.padding
      );
    }
  }
}
