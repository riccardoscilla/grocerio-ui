import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-timer-page',
  template: ` 
    <app-scaffold [refresh]="false">
      <app-title appbar [title]="'Timer'" [back]="'/more'"></app-title>
      
      <app-container content [padding]="'16px'">
        <app-timer></app-timer>
        {{ notificationPermissionInfo }}
      </app-container>

      <app-menu-bottom bottomtabbar />
    </app-scaffold>
  `,
})
export class TimerPageComponent implements OnInit {
  notificationPermissionInfo: string;

  ngOnInit(): void {
    this.requestNotificationPermission();
  }

  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
        if (permission !== 'granted') {
          this.notificationPermissionInfo = 'Notifications are blocked.';
          console.warn('Notifications are blocked.');
        } else {
          this.notificationPermissionInfo = 'Notifications granted';
        }
      });
    } else {
      this.notificationPermissionInfo =
        'Notifications API not supported in this browser.';
      console.warn('Notifications API not supported in this browser.');
    }
  }
}
