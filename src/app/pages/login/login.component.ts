import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../model/login';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = ""
  password: string = ""

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  gotoRegister() {
    this.router.navigate(['register'])
  }

  loginTest() {
    this.username = 'provaciao@mail.com'
    this.password = 'password'
    this.login()
  }

  login() {
    const login = {
      email: this.username,
      password: this.password
    } as Login;

    this.authService.login(login).subscribe({
      next: (token) => {
        this.authService.saveToken(token)
        this.router.navigate(['shelf'])
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Login'});
      }
    })
  }
}
