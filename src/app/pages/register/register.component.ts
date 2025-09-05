import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Register } from '../../model/register';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  template: `
    <app-title [title]="'Register'"></app-title>
    <app-container [padding]="'16px'">
      <app-row [label]="'Email'">
        <input #fullflex type="text" pInputText [(ngModel)]="username" placeholder="Email" />
      </app-row>
      <app-row [label]="'Password'">
        <p-password #fullflex [(ngModel)]="password" [feedback]="false" [toggleMask]="true" placeholder="Password" />
      </app-row>
      <app-row [label]="'Repeat Password'">
        <p-password #fullflex [(ngModel)]="repeatedPassword" [feedback]="false" [toggleMask]="true" placeholder="Repeat Password" />
      </app-row>
      <app-row>
        <app-button #fullflex label="Register" (onClick)="register()" />
      </app-row>
      <app-row>
        <span>Already have an account?</span>
        <app-button #fullflex label="Login" (onClick)="gotoLogin()" />
      </app-row>
    </app-container>
  `,
})
export class RegisterComponent {
  username: string;
  password: string;
  repeatedPassword: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  gotoLogin() {
    this.router.navigate(['login']);
  }

  register() {
    const register = {
      email: this.username,
      password: this.password,
      repeatedPassword: this.repeatedPassword,
    } as Register;

    this.authService.register(register).subscribe({
      next: (authResponse) => {
        this.authService.saveAuthResponse(authResponse);
        this.router.navigate(['shelf-join']);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error Register");
      },
    });
  }
}
