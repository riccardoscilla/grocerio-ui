import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../model/login';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  template: `
    <app-title [title]="'Login'" [onPrimary]="false"></app-title>
    <app-container [padding]="'16px'">
      <app-row [label]="'Email'">
        <input #fullflex type="text" pInputText [(ngModel)]="username" placeholder="Email" />
      </app-row>
      <app-row [label]="'Password'">
        <p-password #fullflex [(ngModel)]="password" [feedback]="false" [toggleMask]="true" placeholder="Password"/>
      </app-row>

      <app-container />

      <app-row>
        <app-button #fullflex label="Login" (onClick)="login()" />
      </app-row>
      <app-row>
        <app-button #fullflex label="Login Demo" variant="outlined" (onClick)="loginDemo()" />
      </app-row>

      <app-container />

      <app-row>
        <span>Don't have an account?</span>
        <app-button #fullflex label="Register" variant="outlined" (onClick)="gotoRegister()" />
      </app-row>
    </app-container>
  `,
  styles: [],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  gotoRegister() {
    this.router.navigate(['register']);
  }

  loginDemo() {
    this.username = 'demo@demo.com';
    this.password = 'demo';
    this.login();
  }

  login() {
    const login = {
      email: this.username,
      password: this.password,
    } as Login;

    this.authService.login(login).subscribe({
      next: (authResponse) => {
        this.authService.saveAuthResponse(authResponse);
        if (authResponse.shelf_id) this.router.navigate(['shelf']);
        else this.router.navigate(['shelf-join']);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error Login");
      },
    });
  }
}
