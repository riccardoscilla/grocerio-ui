import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from './auth.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }

  handleSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message})
  }

  handleError(error: HttpErrorResponse, message: string) {
    console.error('Error:', error)

    if (error.status === HttpStatusCode.Unauthorized) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Unauthorized"})
      this.authService.removeToken()
      this.router.navigateByUrl(`/login`)
      return
    }

    this.messageService.add({ severity: 'error', summary: 'Error', detail: message})
  }

  handleErrorCode(code: HttpStatusCode, message: string | undefined = "") {
    if (code === HttpStatusCode.Unauthorized) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Unauthorized"})
      this.authService.removeToken()
      this.router.navigateByUrl(`/login`)
      return
    }

    this.messageService.add({ severity: 'error', summary: 'Error', detail: message})
  }

  handleResults(results: any) {
    const allError401 = Object
          .values(results)
          .every((err) => err instanceof HttpErrorResponse && err.status === 401)

    if (allError401)
      this.handleErrorCode(HttpStatusCode.Unauthorized)
  }


}
