import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthenticationService } from '../../authentication/services/authentication.service';

/**
 * Not Authentication Guard
 * @author Paul GUINARD
 * @export NotAuthGuard
 * @class NotAuthGuard
 * @implements {CanActivate}
 */
@Injectable()
export class NotAuthGuard implements CanActivate {

  /**
   * Creates an instance of NotAuthGuard.
   * @param {AuthenticationService} _authService authentication
   * @memberof NotAuthGuard
   */
  constructor(
    private _authService: AuthenticationService
  ) { }

  /**
   * Défini les routes activable quand non authentifier
   *
   * @param {ActivatedRouteSnapshot} next next
   * @param {RouterStateSnapshot} state state
   * @memberof NotAuthGuard
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this._authService.loggedIn()) {
      return false;
    }
    return true;
  }
}
