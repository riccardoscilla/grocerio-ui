import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-gif',
  template: ``,
  styles: [`
    :host {
      display: inline-block;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }
  `]
})
export class GifComponent {
  @HostBinding('style.background-image')
  private _backgroundImage!: string;

  @HostBinding('style.width')
  private _width!: string;

  @HostBinding('style.height')
  private _height!: string;

  @Input()
  public set path(filePath: string) {
    this._backgroundImage = `url("assets/gif/${filePath}")`;
  }

  @Input()
  public set size(size: number) {
    this._width = `${size}px`;
    this._height = `${size}px`;
  }
}
