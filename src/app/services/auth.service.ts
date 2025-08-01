import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../model/login';
import { AuthResponse } from '../model/authResponse';
import { environment } from '../../environments/environment';
import { Register } from '../model/register';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private tokenName = 'grocerio';

  constructor(private http: HttpClient) {}

  login(login: Login): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl + '/signIn', login);
  }

  register(register: Register): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl + '/signUp', register);
  }

  validateToken() {
    
  }

  saveAuthResponse(token: AuthResponse) {
    localStorage.setItem(this.tokenName, JSON.stringify(token));
  }

  removeAuthResponse() {
    localStorage.removeItem(this.tokenName);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.tokenName) !== null;
  }

  getAuthResponse(): AuthResponse {
    const token = localStorage.getItem(this.tokenName);
    return JSON.parse(token as string) as AuthResponse;
  }
}
