import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// Models
import { User } from '../shared/models/User';
import { Compte } from '../shared/models/Compte';

/**
 * Gestion Compte Utilisateur Service
 * @author Paul GUINARD
 * @export
 * @class CompteService
 */
@Injectable()
export class CompteService {
  private url: string;
  authToken: string;
  private authHeaders: HttpHeaders;

  /**
   * Creates an instance of CompteService.
   * @param {HttpClient} _http httpClient
   * @memberof CompteService
   */
  constructor(
    private _http: HttpClient
  ) {
    this.authToken = '';
    this.authHeaders = new HttpHeaders();
    this.url = 'http://localhost:3000/compte';
  }

  /**
   * Crée ['authorization'] headers en se basant sur le token dans localStorage
   *
   * @private
   * @memberof CompteService
   */
  private createAuthHeaders() {
    this.getToken();
    this.authHeaders = new HttpHeaders({
      'Content-type': 'application/json',
      'authorization': this.authToken
    });
  }

  /**
   * Get token du localStorage
   *
   * @private
   * @memberof CompteService
   */
  private getToken() {
    this.authToken = localStorage.getItem('token');
  }

  /**
   * Get Compte by Email
   *
   * @param {string} email Compte email
   * @memberof CompteService
   */
  getCompteByEmail(email: string): Observable<any> {
    return this._http.get(`${this.url}/email/${email}`);
  }

  /**
   * Get Compte by Id
   *
   * @param {number} id Compte id
   * @memberof CompteService
   */
  getCompteById(id: number): Observable<any> {
    return this._http.get(`${this.url}/id/${id}`);
  }

  /**
   * Get Compte Profile si token existe et non expiré
   *
   * @memberof CompteService
   */
  getProfile(): Observable<any> {
    this.createAuthHeaders();
    if (this.authToken !== undefined) {
      return this._http.get(`${this.url}/profile`, { headers: this.authHeaders });
    }
  }

}
