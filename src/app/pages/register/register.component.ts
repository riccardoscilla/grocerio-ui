import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Register } from '../../model/register';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username: string
  password: string
  repeatedPassword: string
  shelfName: string
  shareId: string

  shelfOption: boolean = false
  shelfOptions: any[] = [
    { label: 'New shelf', value: false },
    { label: 'Join shelf', value: true }
  ];

  constructor(
      private authService: AuthService,
      private router: Router,
      private messageService: MessageService
    ) { }
  
  gotoLogin() {
    this.router.navigate(['login'])
  }

  register() {
    const register = {
      email: this.username,
      password: this.password,
      repeatedPassword: this.repeatedPassword,
    } as Register

    if (this.shelfOption) {
      register.shareId = this.shareId
    } else {
      register.shelfName = this.shelfName
    }
      

    this.authService.register(register).subscribe({
      next: (token) => {
        this.authService.saveToken(token)
        this.router.navigate(['shelf'])
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Register'});
      }
    })
  }

}
