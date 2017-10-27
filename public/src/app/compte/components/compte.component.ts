import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Services
import { CompteService } from '../compte.service';
import { FlashMsgService } from '../../shared/services/flash-msg.service';
// Models
import { User } from '../../shared/models/User';

/**
 * Page Compte utilisateur
 * @author Paul GUINARD
 * @export CompteComponent
 * @class CompteComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: [ './compte.component.css' ]
})
export class CompteComponent implements OnInit {
  user: User;

  /**
   * Creates an instance of CompteComponent.
   * @param {CompteService} _compteService compte
   * @param {FlashMsgService} _flashMsg Flash Msg
   * @param {Router} _router router
   * @memberof CompteComponent
   */
  constructor(
    private _compteService: CompteService,
    private _flashMsg: FlashMsgService,
    private _router: Router
  ) {
    this.user = new User();
  }

  /**
   * Get Compte utilisateur profile
   *
   * @memberof CompteComponent
   */
  getProfile() {
    this._compteService.getProfile()
      .subscribe(user => {
        this.user = user.obj;
      }, err => console.log(err)
      );
  }

  /**
   * OnInit.
   * - Get profile compte utilisateur
   *
   * @memberof CompteComponent
   */
  ngOnInit() {
    this.getProfile();
  }

}
