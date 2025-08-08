import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'grocerio-ui'; 

  height: number;

  private onResizeVh = () => {};

  ngAfterViewInit(): void {
    this.initResizeVh();
  }

  initResizeVh() {
    this.onResizeVh = () => {
      const vh = this.height * 0.01;
      document.documentElement.style.setProperty('--real-vh', `${vh}px`);
    };

    this.height = window.innerHeight;

    this.onResizeVh();

    window.addEventListener("resize", this.onResizeVh);
    window.addEventListener("orientationchange", this.onResizeVh);
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.onResizeVh);
    window.removeEventListener("orientationchange", this.onResizeVh);
  }

}
