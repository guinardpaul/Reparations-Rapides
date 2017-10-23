import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthenticationService } from '../../authentication/services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  redirectURL: string;

  constructor(
    private _authService: AuthenticationService,
    private _router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this._authService.loggedIn()) {
      return true;
    }
    this.redirectURL = state.url;
    this._router.navigate([ '/login' ]);
    return false;
  }
}
