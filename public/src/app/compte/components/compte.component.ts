import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { CompteService } from '../compte.service';
import { FlashMsgService } from '../../shared/services/flash-msg.service';

// Models
import { User } from '../../shared/models/User';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: [ './compte.component.css' ]
})
export class CompteComponent implements OnInit {
  user: User;

  constructor(
    private _compteService: CompteService,
    private _flashMsg: FlashMsgService,
    private _router: Router
  ) {
    this.user = new User();
  }

  getProfile() {
    this._compteService.getProfile()
      .subscribe(user => {
        this.user = user.obj;
      }, err => console.log(err)
      );
  }

  ngOnInit() {
    this.getProfile();
  }

}
