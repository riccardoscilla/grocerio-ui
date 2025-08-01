import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-more',
  template: ` <app-title [title]="'More'"></app-title>

    <app-container [padding]="'16px'">
      <app-list>
        <app-list-item
          [contentText]="'Items'"
          [angleRightButton]="true"
          [url]="'/items'"
        ></app-list-item>
        <app-list-item
          [contentText]="'Categories'"
          [angleRightButton]="true"
          [url]="'/categories'"
        ></app-list-item>
        <app-list-item
          [contentText]="'Share Shelf'"
          [angleRightButton]="true"
          [url]="'/share-shelf'"
        ></app-list-item>
        <app-list-item
          [contentText]="'Timer'"
          [angleRightButton]="true"
          [url]="'/timer'"
        ></app-list-item>
      </app-list>
      
      <p-button [outlined]="true" label="Logout" (click)="logout()" />
      <div>
      </div>
    </app-container>
    <app-menu-bottom></app-menu-bottom>`,
})
export class MoreComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.removeAuthResponse();
    this.router.navigateByUrl(`/welcome`);
  }
}
