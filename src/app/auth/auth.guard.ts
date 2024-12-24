import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { inject, Injectable } from '@angular/core'
import { ToastService } from '../services/toast.service'
import { HttpStatusCode } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
class AuthGuardService {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this.authService.isLoggedIn())
      return true
   
    this.router.navigate(['/login'])
    this.toastService.handleErrorCode(HttpStatusCode.Unauthorized)
    return false
  }
}

export const AuthGuard: CanActivateFn = (route, state) => {
  return inject(AuthGuardService).canActivate(route, state)
}
