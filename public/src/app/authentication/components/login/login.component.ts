import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
// Models
import { User } from '../../../shared/models/User';
// Services
import { FlashMsgService } from '../../../shared/services/flash-msg.service';
import { AuthenticationService } from '../../services/authentication.service';
// Guards
import { AuthGuard } from '../../../routing/guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  user: User;
  processing: boolean;
  previousUrl: string;

  get email(): string { return this.loginForm.get('email').value as string; }
  get password(): string { return this.loginForm.get('password').value as string; }

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthenticationService,
    private _flashMsg: FlashMsgService,
    private _authGuard: AuthGuard,
    private _router: Router
  ) {
    this.createForm();
    this.user = new User();
    this.processing = false;
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
    this.processing = true;

    this.user = {
      email: this.email,
      password: this.password
    };

    this._authService.login(this.user)
      .subscribe(data => {
        console.log('login...');
        console.log(data);
        if (data.info.success) {
          this._authService.storeUserData(data.token, data.info.obj);
          this._flashMsg.displayMsg('Connexion avec succés', 'alert-success', 1500);
          setTimeout(() => {
            if (this.previousUrl) {
              this._router.navigate([ this.previousUrl ]);
            } else {
              this._router.navigate([ '/' ]);
            }
          }, 1000);
        }
      }, err => {
        this.processing = false;
        if (!err.ok) {
          this._flashMsg.displayMsg('Email ou mot de passe invalide', 'alert-danger', 1500);
        } else {
          console.log(err);
        }
      });
  }

  ngOnInit() {
    if (this._authGuard.redirectURL) {
      this._flashMsg.displayMsg('Vous devez être connecté pour accéder à cette page', 'alert-warning', 2000);
      this.previousUrl = this._authGuard.redirectURL;
      this._authGuard.redirectURL = undefined;
    }
  }

}
