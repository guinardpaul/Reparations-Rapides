import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../../shared/models/User';
import { CompteService } from '../../../compte/compte.service';
import { FlashMsgService } from '../../../shared/services/flash-msg.service';

@Component({
  selector: 'app-validate-account',
  templateUrl: './validate-account.component.html',
  styleUrls: [ './validate-account.component.css' ]
})
export class ValidateAccountComponent implements OnInit {// TODO: A vérifier
  idUser: number;

  constructor(
    private _compteService: CompteService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _flashMsg: FlashMsgService
  ) { }

  getUserById(id: number) {
    this._compteService.getUserById(id)
      .subscribe(data => {
        console.log(data);
        if (data.success) {
          this.ValidateAccount(data.obj);
        } else {
          console.log(data.message);
        }
      }, err => console.log(err)
      );
  }

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

  ngOnInit() {
    if (this._activatedRoute.snapshot.params[ '_id' ] !== undefined) {
      this.idUser = this._activatedRoute.snapshot.params[ '_id' ];
      this.getUserById(this.idUser);
    } else {
      this._flashMsg.displayMsg('Lien invalide', 'alert-danger', 3000);
      this._router.navigate([ '/' ]);
    }
  }

}
