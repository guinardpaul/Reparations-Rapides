import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// Models
import { User } from '../shared/models/User';

@Injectable()
export class CompteService {
  private url: string;
  authToken: string;
  private authHeaders: HttpHeaders;

  constructor(
    private _http: HttpClient
  ) {
    this.authToken = '';
    this.authHeaders = new HttpHeaders();
    this.url = 'http://localhost:3000/users';
  }

  private createAuthHeaders() {
    this.getToken();
    this.authHeaders = new HttpHeaders({
      'Content-type': 'application/json',
      'authorization': this.authToken
    });
  }

  private getToken() {
    this.authToken = localStorage.getItem('token');
  }

  getUserByEmail(email: string): Observable<any> {
    return this._http.get(`${this.url}/email/${email}`);
  }

  getUserById(id: number): Observable<any> {
    return this._http.get(`${this.url}/id/${id}`);
  }

  getProfile(): Observable<any> {
    this.createAuthHeaders();
    if (this.authToken !== undefined) {
      return this._http.get(`${this.url}/profile`, { headers: this.authHeaders });
    }
  }

  initUserPassword(user: User): Observable<any> {
    console.log(user);
    return this._http.put(`${this.url}/init-password/${user._id}`, user);
  }

  validateAccount(user: User): Observable<any> {
    user.validAccount = true;
    return this._http.put(`${this.url}/validate-account/${user._id}`, user);
  }

  checkEmailUnicite(email: string): Observable<any> {
    return this._http.get(`${this.url}/checkEmail/${email}`);
  }

}
