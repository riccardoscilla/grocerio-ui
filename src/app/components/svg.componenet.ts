import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-svg',
  template: ``,
  styles: [`
    :host {
        mask-size: contain;
        mask-position: center;
        mask-repeat: no-repeat;

        width: 20px;
        height: 20px;
    }
  `]
})
export class SvgComponent {
    @HostBinding('style.-webkit-mask-image')
    private _path!: string;
  
    @HostBinding('style.background-color')
    private _color!: string;
  
    @HostBinding('style.width')
    private _width!: string;
  
    @HostBinding('style.height')
    private _height!: string;
  
    @Input()
    public set path(filePath: string) {
      this._path = `url("assets/svg-icons/${filePath}")`;
    }
  
    @Input()
    public set color(color: string) {
      this._color = color;
    }
  
    @Input()
    public set size(size: number) {
      this._width = `${size}px`;
      this._height = `${size}px`;
    }
}
