import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../authentication/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [ './navbar.component.css' ]
})
export class NavbarComponent implements OnInit {

  constructor(
    private _authService: AuthenticationService,
    private _router: Router
  ) { }

  /**
   * On Logout method:
   * - clear token and user on localStorage
   * - navigate HomePage
   * @memberof NavbarComponent
   */
  onLogout() {
    this._authService.clearLocalStorage();
    this._router.navigate([ '/home' ]);
  }

  ngOnInit() {
  }

}
