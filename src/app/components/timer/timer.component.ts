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
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('assets/sw.js')
        .then(reg => console.log('Service Worker registered!', reg))
        .catch(err => console.error('Service Worker registration failed:', err));
    }

    if (typeof Worker !== 'undefined') {
      try {
        this.worker = new Worker(new URL('../../timer.worker', import.meta.url), { type: 'module' });
        console.log('Web Worker initialized');

        this.worker.onmessage = ({ data }) => {
          if (data === 'done') {
            console.log("received done")
            this.running = false;
            this.sendNotification();
          } else {
            this.elapsedTime = data;
          }
        };
      } catch (error) {
        console.error('Error initializing Web Worker:', error);
      }
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
    if (Notification.permission === 'granted' && navigator.serviceWorker) {
      // pwa notification
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('Countdown finished!', {
          body: 'Your timer has reached 0.',
        });
      });

      // browser notification
      new Notification('Countdown finished!', { body: 'Your timer has reached 0.' });
    } else {
      console.warn('Notifications not available.');
    }
  }  

  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
        if (permission !== 'granted') {
          console.warn('Notifications are blocked.');
        }
      });
    } else {
      console.warn('Notifications API not supported in this browser.');
    }
  }

  ngOnDestroy(): void {
    this.worker.terminate();
  }
}
