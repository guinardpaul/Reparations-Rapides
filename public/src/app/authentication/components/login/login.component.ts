import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../../shared/models/User';

// import { FlashMsgService } from '../../../shared/services/flash-msg.service';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  user: User;
  previousUrl;

  get email(): string { return this.loginForm.get('email').value as string; }
  get password(): string { return this.loginForm.get('password').value as string; }

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthenticationService,
    private _router: Router
  ) {
    this.createForm();
    this.user = new User();
  }

  createForm() {
    this.loginForm = this._fb.group({
      email: [ '', Validators.compose([
        Validators.required
      ]) ],
      password: [ '', Validators.compose([
        Validators.required
      ]) ]
    });
  }

  onLogin() {
    this.user = {
      email: this.email,
      password: this.password
    };

    this._authService.login(this.user)
      .subscribe(data => {
        console.log('login...');
        console.log(data);
        if (data.success) {
          console.log(data.info);
        } else {
          console.log(data);
        }
      }, err => {
        console.log(err);
      });
  }

  ngOnInit() {

  }

}
