import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { User } from '../models/User';

@Injectable()
export class UserService {
  url: string;
  constructor(
    private _http: HttpClient
  ) {
    this.url = 'http://localhost:3000/users'
  }

  getProfileByEmail(email: string): Observable<any> {
    return this._http.get(`${this.url}/email/${email}`);
  }

}
