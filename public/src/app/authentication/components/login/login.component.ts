import { Component, OnInit, ElementRef, ViewChild, Renderer } from '@angular/core';
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
  @ViewChild('emailInput') emailInput: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;
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
    private _router: Router,
    private _renderer: Renderer
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
          this._flashMsg.displayMsg(err.error.message, 'alert-danger', 3000);
        } else {
          console.log(err);
        }
      });
  }

  ngOnInit() {
    if (localStorage.getItem('init-password')) {
      this.loginForm.get('email').setValue(localStorage.getItem('init-password'));
      this._renderer.invokeElementMethod(this.passwordInput.nativeElement, 'focus');
      localStorage.clear();
    }

    if (this._authGuard.redirectURL) {
      this._flashMsg.displayMsg('Vous devez être connecté pour accéder à cette page', 'alert-warning', 2000);
      this.previousUrl = this._authGuard.redirectURL;
      this._authGuard.redirectURL = undefined;
    }
  }

}
