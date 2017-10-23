import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired } from 'angular2-jwt';
// Models
import { User } from '../../shared/models/User';

@Injectable()
export class AuthenticationService {
  private url: string;
  private authToken: string;
  private authHeaders: HttpHeaders;

  constructor(
    private _http: HttpClient
  ) {
    this.url = 'http://localhost:3000/auth';
  }

  storeUserData(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  login(user: User): Observable<any> {
    return this._http.post(`${this.url}/login`, user);
  }

  register(user: User): Observable<any> {
    return this._http.post(`${this.url}/register`, user);
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  loggedIn() {
    return tokenNotExpired();
  }

}
