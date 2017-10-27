import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthenticationService } from '../../authentication/services/authentication.service';

/**
 * Authentication Guard
 * @author Paul GUINARD
 * @export AuthGuard
 * @class AuthGuard
 * @implements {CanActivate}
 */
@Injectable()
export class AuthGuard implements CanActivate {
  redirectURL: string;

  /**
   * Creates an instance of AuthGuard.
   * @param {AuthenticationService} _authService authentication
   * @param {Router} _router router
   * @memberof AuthGuard
   */
  constructor(
    private _authService: AuthenticationService,
    private _router: Router
  ) { }

  /**
   * Défini route activable quand authentifier
   *
   * @param {ActivatedRouteSnapshot} next next
   * @param {RouterStateSnapshot} state state
   * @memberof AuthGuard
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this._authService.loggedIn()) {
      return true;
    }
    this.redirectURL = state.url;
    this._router.navigate([ '/login' ]);
    return false;
  }
}
