import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html'
})
export class MoreComponent {

  constructor( 
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.removeToken()
    this.router.navigateByUrl(`/login`)
  }
}
