import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Models
import { User } from '../../../shared/models/User';
// Services
import { CompteService } from '../../../compte/compte.service';
import { FlashMsgService } from '../../../shared/services/flash-msg.service';

/**
 * Validation compte utilisateur
 * @author Paul GUINARD
 * @export
 * @class ValidateAccountComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-validate-account',
  templateUrl: './validate-account.component.html',
  styleUrls: [ './validate-account.component.css' ]
})
export class ValidateAccountComponent implements OnInit {
  idUser: number;

  /**
   * Creates an instance of ValidateAccountComponent.
   * @param {CompteService} _compteService Compte Utilisateur
   * @param {ActivatedRoute} _activatedRoute get router params
   * @param {Router} _router router
   * @param {FlashMsgService} _flashMsg Flash Msg
   * @memberof ValidateAccountComponent
   */
  constructor(
    private _compteService: CompteService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _flashMsg: FlashMsgService
  ) { }

  /**
   * Get User data by Id. Appelé onInit quand params Id récupéré dans l'url.
   * - Appel ValidateAccount() on success
   *
   * @param {number} id user id
   * @memberof ValidateAccountComponent
   */
  getUserById(id: number) {
    this._compteService.getUserById(id)
      .subscribe(data => {
        console.log(data);
        if (data.success) {
          // update attribut validAccount du compte utilisateur
          this.ValidateAccount(data.obj);
        } else {
          console.log(data.message);
        }
      }, err => console.log(err)
      );
  }

  /**
   * Update attribut validAccount du compte utilisateur. Appelé par getUserById()
   *
   * @param {User} user User Object
   * @memberof ValidateAccountComponent
   */
  ValidateAccount(user: User) {
    this._compteService.validateAccount(user)
      .subscribe(data => {
        console.log(data);
        if (data.success) {
          console.log(data.message);
        } else {
          console.log(data.message);
        }
      }, err => console.log(err)
      );
  }

  /**
   * OnInit.
   * - Get Id params définie dans l'url de l'email
   * - Get User data store in database by Id
   *
   * @memberof ValidateAccountComponent
   */
  ngOnInit() {
    if (this._activatedRoute.snapshot.params[ '_id' ] !== undefined) {
      this.idUser = this._activatedRoute.snapshot.params[ '_id' ];
      // Get User data
      this.getUserById(this.idUser);
    } else {
      this._flashMsg.displayMsg('Lien invalide', 'alert-danger', 3000);
      this._router.navigate([ '/' ]);
    }
  }

}
