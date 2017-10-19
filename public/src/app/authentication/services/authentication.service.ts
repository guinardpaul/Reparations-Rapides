import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { User } from '../../shared/models/User';

@Injectable()
export class AuthenticationService {
  url: string;

  constructor(
    private _http: HttpClient
  ) {
    this.url = 'http://localhost:3000/auth';
  }

  login(user: User): Observable<any> {
    return this._http.post(`${this.url}/login`, user);
  }

  register(user: User): Observable<any> {
    return this._http.post(`${this.url}/register`, user);
  }

}
