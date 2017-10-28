import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired } from 'angular2-jwt';
// Models
import { User } from '../../shared/models/User';
import { RegisterUserCompte } from '../../shared/models/RegisterUserCompte';

/**
 * Authentication Service
 * @author Paul GUINARD
 * @export AuthenticationService
 * @class AuthenticationService
 */
@Injectable()
export class AuthenticationService {
  private url: string;
  private authToken: string;
  private authHeaders: HttpHeaders;

  /**
   * Creates an instance of AuthenticationService.
   * @param {HttpClient} _http httpClient
   * @memberof AuthenticationService
   */
  constructor(
    private _http: HttpClient
  ) {
    this.url = 'http://localhost:3000/auth';
  }

  /**
   * Store token et user in localStorage
   *
   * @param {string} token token
   * @param {User} user User Object
   * @memberof AuthenticationService
   */
  storeUserData(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Login User
   *
   * @param {User} user User Object
   * @memberof AuthenticationService
   */
  login(user: User): Observable<any> {
    return this._http.post(`${this.url}/login`, user);
  }

  /**
   * Register User
   *
   * @param {RegisterUserCompte} registerData RegisterUserCompte Object
   * @memberof AuthenticationService
   */
  register(registerData: RegisterUserCompte): Observable<any> {
    return this._http.post(`${this.url}/register`, registerData);
  }

  /**
   * Clear le localStorage
   *
   * @memberof AuthenticationService
   */
  clearLocalStorage() {
    localStorage.clear();
  }

  /**
   * Vérifie si token dans localStorage et tokenNotExpired
   *
   * @returns {boolean} tokenNotExpired
   * @memberof AuthenticationService
   */
  loggedIn(): boolean {
    return tokenNotExpired();
  }

}
