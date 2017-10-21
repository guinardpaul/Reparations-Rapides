import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

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

  getProfile(): Observable<any> {
    this.createAuthHeaders();
    if (this.authToken !== undefined) {
      return this._http.get(`${this.url}/profile`, { headers: this.authHeaders });
    }
  }

}
