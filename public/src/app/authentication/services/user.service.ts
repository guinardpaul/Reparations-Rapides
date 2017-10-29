import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// Models
import { User } from '../../shared/models/User';

/**
 * User Service
 * @author Paul GUINARD
 * @export
 * @class UserService
 */
@Injectable()
export class UserService {
  private url: string;

  /**
   * Creates an instance of UserService.
   * @param {HttpClient} _http httpClient
   * @memberof CompteService
   */
  constructor(
    private _http: HttpClient
  ) {
    this.url = 'http://localhost:3000/users';
  }

  /**
   * Get User by Email
   *
   * @param {string} email user email
   * @memberof CompteService
   */
  getUserByEmail(email: string): Observable<any> {
    return this._http.get(`${this.url}/email/${email}`);
  }

  /**
   * Get User by Id
   *
   * @param {number} id user id
   * @memberof CompteService
   */
  getUserById(id: number): Observable<any> {
    return this._http.get(`${this.url}/id/${id}`);
  }

  /**
   * Réinitialise User password
   *
   * @param {User} user User Object
   * @memberof CompteService
   */
  initUserPassword(user: User): Observable<any> {
    console.log(user);
    return this._http.put(`${this.url}/init-password/${user._id}`, user);
  }

  /**
   * Valide le compte utilisateur => update attribut validAccount
   *
   * @param {User} user User Object
   * @memberof CompteService
   */
  validateAccount(user: User): Observable<any> {
    user.validAccount = true;
    return this._http.put(`${this.url}/validate-account/${user._id}`, user);
  }

  /**
   * Vérifie l'unicité de l'email lors de la création de compte
   *
   * @param {string} email user email
   * @memberof CompteService
   */
  checkEmailUnicite(email: string): Observable<any> {
    return this._http.get(`${this.url}/checkEmail/${email}`);
  }

}
