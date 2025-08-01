import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from './auth.service';
import {
  HttpErrorResponse,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  handleSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  handleError(error: HttpErrorResponse, message: string) {
    console.error('Error:', error);

    if (error.status === HttpStatusCode.Unauthorized) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unauthorized',
      });
      this.authService.removeAuthResponse();
      this.router.navigateByUrl(`/welcome`);
      return;
    }

    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  handleErrorCode(code: HttpStatusCode, message: string | undefined = '') {
    if (code === HttpStatusCode.Unauthorized) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unauthorized',
      });
      this.authService.removeAuthResponse();
      this.router.navigateByUrl(`/welcome`);
      return;
    }

    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  handleResults(results: any) {
    
    const all200 = Object.values(results).every(
      (response) => response instanceof HttpResponse && response.status === 200
    );

    // if (all200) return;

    // this.handleErrorCode(HttpStatusCode.Unauthorized);

    const allError401 = Object.values(results).every(
      (err) => err instanceof HttpErrorResponse && err.status === 401
    );

    if (allError401) this.handleErrorCode(HttpStatusCode.Unauthorized);

    const allError404 = Object.values(results).every(
      (err) => err instanceof HttpErrorResponse && err.status === 404
    );

    if (allError404) this.handleErrorCode(HttpStatusCode.Unauthorized);
  }
}
