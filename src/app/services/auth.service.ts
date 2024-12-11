import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../model/login';
import { Token } from '../model/token';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth'
  private tokenName = 'grocerio'

  constructor(private http: HttpClient) { }


  login(login: Login): Observable<Token> {
    return this.http.post<Token>(this.apiUrl+'/signIn', login)
  }

  saveToken(token: Token) {
    localStorage.setItem(this.tokenName, JSON.stringify(token))
  }

  removeToken() {
    localStorage.removeItem(this.tokenName)
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.tokenName) !== null
  }

  getToken(): Token {
    const token = localStorage.getItem(this.tokenName)
    return JSON.parse(token as string) as Token
  }

}
