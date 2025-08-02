import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  QueryList,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-container',
  template: ` <ng-content></ng-content> `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 16px;
      width: 100%;
    }
    .p-flex {
      flex: 1;
    }
    .p-flex > *:first-child {
      width: 100%;
    }
  `,
})
export class ContainerComponent implements AfterContentInit {
  @Input() padding = '';
  @Input() height = '';

  constructor(private hostRef: ElementRef, private renderer: Renderer2) {}

  @ContentChildren('fullflex', { descendants: true, read: ElementRef })
  fullflexItems!: QueryList<ElementRef>;

  ngAfterContentInit() {
    this.fullflexItems.forEach((item) =>
      this.renderer.addClass(item.nativeElement, 'p-flex')
    );
    if (this.padding) {
      this.renderer.setStyle(this.hostRef.nativeElement, 'padding', this.padding);
    }
    if (this.height) {
      this.renderer.setStyle(this.hostRef.nativeElement, 'height', this.height);
    }
  }
}
