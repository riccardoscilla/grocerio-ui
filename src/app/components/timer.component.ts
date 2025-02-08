import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  template: `
    <div class="container">
      <div style="">
        {{ elapsedTime / 1000 }}s
      </div>

      <p-button *ngIf="!running" icon="pi pi-play" [rounded]="true" [outlined]="true" (click)="startTimer()"/>
      <p-button *ngIf="running" icon="pi pi-pause" [rounded]="true" [outlined]="true" (click)="pauseTimer()"/>
      <p-button icon="pi pi-refresh" [rounded]="true" [outlined]="true" (click)="resetTimer()"/>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class TimerComponent implements OnInit, OnDestroy {
  private worker!: Worker;
  elapsedTime = 5000;
  running = false;

  ngOnInit(): void {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('../timer.worker', import.meta.url), { type: 'module' });

      this.worker.onmessage = ({ data }) => {
        if (data === 'done') {
          this.running = false;
          this.sendNotification();
        } else {
          this.elapsedTime = data;
        }
      };
    } else {
      console.error('Web Workers not supported in this browser.');
    }

    this.requestNotificationPermission();
  }

  startTimer() {
    if (!this.running) {
      this.worker.postMessage({ command: 'start', startTime: this.elapsedTime });
      this.running = true;
    }
  }

  pauseTimer() {
    this.worker.postMessage({ command: 'pause' });
    this.running = false;
  }

  resetTimer() {
    this.worker.postMessage({ command: 'reset' });
    this.elapsedTime = 5000;
    this.running = false;
  }

  sendNotification() {
    if (Notification.permission === 'granted') {
      new Notification('Countdown finished!', { body: 'Your timer has reached 0.' });
    }
  }

  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission !== 'granted') {
          console.warn('Notifications are blocked.');
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.worker.terminate();
  }
}
