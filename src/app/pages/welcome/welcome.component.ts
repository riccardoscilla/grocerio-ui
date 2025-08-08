import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-welcome',
  template: `
    <app-container [height]="'20vh'" />
    <app-container [padding]="'16px'">
      <app-row [center]="true">
        <app-gif [path]="'grocery.gif'" [size]="200"></app-gif>
      </app-row>

      <app-container *ngIf="showButtons">
        <app-row [center]="true">
          <div class="title">Welcome to Grocerio</div>
        </app-row>
        <app-row>
          <p-button #fullflex label="Login" (click)="gotoLogin()" />
        </app-row>
        <app-row>
          <p-button #fullflex label="Register" [outlined]="true" (click)="gotoRegister()"/>
        </app-row>
      </app-container>
    </app-container>
  `,
  styles: [
    `
      .title {
        font-size: 28px;
        font-weight: 500;
        color: var(--background-text-color);
      }
    `,
  ],
})
export class WelcomeComponent implements OnInit {

  showButtons = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn())
      return;
    
    
    this.apiService.getShelf().subscribe({
      next: (_: any) => {
        this.router.navigate(['shelf']);
      },
      error: (error: HttpErrorResponse) => {
       this.showButtons = true; 
        // this.toastService.handleError(error, 'Error delete Category');
      },
    });
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }

  gotoRegister() {
    this.router.navigate(['register']);
  }
}
