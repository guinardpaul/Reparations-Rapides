import { Component, OnInit, ElementRef, ViewChild, Renderer } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
// Models
import { User } from '../../../shared/models/User';
// Services
import { FlashMsgService } from '../../../shared/services/flash-msg.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ValidationService } from '../../services/validation.service';
// Guards
import { AuthGuard } from '../../../routing/guards/auth.guard';

/**
 * Connexion Compte utilisateur
 * @author Paul GUINARD
 * @export
 * @class LoginComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
  @ViewChild('passwordInput') passwordInput: ElementRef;
  private loginForm: FormGroup;
  private user: User;
  private processing: boolean;
  private previousUrl: string;

  private get email(): string { return this.loginForm.get('email').value as string; }
  private get password(): string { return this.loginForm.get('password').value as string; }

  /**
   * Creates an instance of LoginComponent.
   * @param {FormBuilder} _fb Reactive Form Builder
   * @param {AuthenticationService} _authService Authentication
   * @param {FlashMsgService} _flashMsg Flash Msg
   * @param {ValidationService} _validationService Validation Form Function
   * @param {AuthGuard} _authGuard route auth guard
   * @param {Router} _router router
   * @param {Renderer} _renderer Permet de modifier le DOM
   * @memberof LoginComponent
   */
  constructor(
    private _fb: FormBuilder,
    private _authService: AuthenticationService,
    private _flashMsg: FlashMsgService,
    private _validationService: ValidationService,
    private _authGuard: AuthGuard,
    private _router: Router,
    private _renderer: Renderer
  ) {
    this.createForm();
    this.user = new User();
    this.processing = false;
  }

  /**
   * Generate loginForm
   *
   * @memberof LoginComponent
   */
  createForm() {
    this.loginForm = this._fb.group({
      email: [ '', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        this._validationService.emailValidation
      ]) ],
      password: [ '', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(150)
      ]) ]
    });
  }

  /**
   * Get Error message du loginForm en fonction des Validators
   *
   * @param {string} arg current Input
   * @returns {string} Error message
   * @memberof LoginComponent
   */
  getErrorMessage(arg: string): string {
    switch (arg) {
      case 'email':
        return this.loginForm.controls[ 'email' ].hasError('required') ? 'Ce champ est requis' :
          this.loginForm.controls[ 'email' ].hasError('emailValidation') ? 'Email invalide' :
            '';

      case 'password':
        return this.loginForm.controls[ 'password' ].hasError('required') ? 'Ce champ est requis' :
          '';

      default:
        break;
    }
  }

  /**
   * Login Compte utilisateur function.
   * - Set User Object
   * - Appel function login du authService
   * - Store user data et token in localStorage
   * - Redirect to home ou previousUrl page
   *
   * @memberof LoginComponent
   */
  onLogin() {
    this.processing = true;
    // Set User Object
    this.user = {
      email: this.email,
      password: this.password
    };
    // Appel function login()
    this._authService.login(this.user)
      .subscribe(data => {
        console.log('login...');
        console.log(data);

        // Si passport return success
        if (data.info.success) {
          // Store user data et token
          this._authService.storeUserData(data.token, data.info.obj);
          this._flashMsg.displayMsg('Connexion avec succés', 'alert-success', 1500);

          // Redirect to home ou previousUrl page
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

  /**
   * On Init.
   * - Vérifie si localStorage contient 'init-password' (page init-password et register onLogin())
   * - Vérifie si l'utilisateur essai de se connecter à une page non autorisé sans etre connecté
   *
   * @memberof LoginComponent
   */
  ngOnInit() {
    // Si init-password: set l'input email et focus sur l'input password
    if (localStorage.getItem('init-password')) {
      this.loginForm.get('email').setValue(localStorage.getItem('init-password'));
      this._renderer.invokeElementMethod(this.passwordInput.nativeElement, 'focus');
      localStorage.clear();
    }

    // Si l'utilisateur a ete redirect par authGuard: set previousUrl pour redirect a la page souhaitée
    if (this._authGuard.redirectURL) {
      this._flashMsg.displayMsg('Vous devez être connecté pour accéder à cette page', 'alert-warning', 2000);
      this.previousUrl = this._authGuard.redirectURL;
      this._authGuard.redirectURL = undefined;
    }
  }

}
