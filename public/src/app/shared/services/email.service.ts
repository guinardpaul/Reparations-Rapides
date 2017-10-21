import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Email } from '../../shared/models/Email';

@Injectable()
export class EmailService {
  private url: string;

  constructor(
    private _http: HttpClient
  ) {
    this.url = 'http://localhost:3000/mail';
  }

  sendMail(forgotPasswordBody: Email): Observable<any> {
    return this._http.post(`${this.url}/sendMail`, forgotPasswordBody);
  }

}
