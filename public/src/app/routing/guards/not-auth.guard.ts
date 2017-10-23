import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthenticationService } from '../../authentication/services/authentication.service';

@Injectable()
export class NotAuthGuard implements CanActivate {

  constructor(
    private _authService: AuthenticationService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this._authService.loggedIn()) {
      return false;
    }
    return true;
  }
}
