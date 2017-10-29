import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// Models
import { User } from '../../../shared/models/User';
// Services
import { CompteService } from '../../../compte/compte.service';
import { FlashMsgService } from '../../../shared/services/flash-msg.service';
import { ValidationService } from '../../services/validation.service';
import { UserService } from '../../services/user.service';

/**
 * Réinitialise password Compte Utilisateur
 * @author Paul GUINARD
 * @export InitPasswordComponent
 * @class InitPasswordComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-init-password',
  templateUrl: './init-password.component.html',
  styleUrls: [ './init-password.component.css' ]
})
export class InitPasswordComponent implements OnInit {
  initPasswordForm: FormGroup;
  processing: boolean;
  user: User;
  userEmail: string;
  userId: number;

  get email(): string { return this.initPasswordForm.get('email').value as string; }
  get passwords() { return this.initPasswordForm.controls[ 'passwords' ] as FormControl; }
  get password() { return this.passwords.get('password').value as string; }
  get confirmPassword() { return this.passwords.get('confirmPassword').value as string; }

  /**
   * Creates an instance of InitPasswordComponent.
   * @param {CompteService} _compteService Compte Utilisateur
   * @param {ValidationService} _validationService Validation Form Function
   * @param {FlashMsgService} _flashMsg Flash Msg
   * @param {FormBuilder} _fb Reactive Form Builder
   * @param {ActivatedRoute} _activatedRoute get router params
   * @param {Router} _router router
   * @memberof InitPasswordComponent
   */
  constructor(
    private _compteService: CompteService,
    private _userService: UserService,
    private _validationService: ValidationService,
    private _flashMsg: FlashMsgService,
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this.createForm();
    this.user = new User();
    this.processing = false;
    this.userEmail = undefined;
  }

  /**
   * Generate initPasswordForm
   *
   * @memberof InitPasswordComponent
   */
  createForm() {
    this.initPasswordForm = this._fb.group({
      email: [ { value: this.userEmail, disabled: true }],
      passwords: this._fb.group({
        password: [ '', Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(150)
        ]) ],
        confirmPassword: [ '', Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(150)
        ]) ],
      }, {
          validator: this._validationService.comparePasswords
        })
    });
  }

  /**
   * Réinitialise password Compte utilisateur.
   * - Set init-password dans le localStorage et redirect to login page on success
   *
   * @memberof InitPasswordComponent
   */
  initPassword() {
    this.processing = false;
    // Set User Object
    const user: User = this.user;
    user.password = this.password;
    console.log(user);

    this._userService.initUserPassword(user)
      .subscribe(data => {
        if (data.success) {
          this._flashMsg.displayMsg('Mot de passe mis à jour. Vous pouvez vous connecter avec votre nouveau password.',
            'alert-success', 3000);

          // Set localStorage init-password on success
          setTimeout(() => {
            localStorage.setItem('init-password', user.email);
            this._router.navigate([ '/login' ]);
          }, 1000);
        } else {
          this._flashMsg.displayMsg('Erreur durant la mise à jour du password. Veuillez réessayer.', 'alert-danger', 2000);
        }
      }, err => console.log(err)
      );
  }

  /**
   * Get User data by Id. Appelé onInit quand params Id récupéré dans l'url.
   *
   * @param {number} id user id
   * @memberof InitPasswordComponent
   */
  getCompteById(id: number) {
    this._compteService.getCompteById(id)
      .subscribe(user => {
        this.user = user.obj;
        this.userEmail = user.obj.email;
        this.initPasswordForm.get('email').setValue(this.userEmail);
      }, err => {
        console.log(err);
      });
  }

  /**
   * OnInit.
   * - Get Id params définie dans l'url de l'email
   * - Get User data store in database by Id
   *
   * @memberof InitPasswordComponent
   */
  ngOnInit() {
    if (this._activatedRoute.snapshot.params[ '_id' ] !== undefined) {
      this.userId = this._activatedRoute.snapshot.params[ '_id' ];
      // Get User data
      this.getCompteById(this.userId);
    } else {
      this._flashMsg.displayMsg('Ce lien a expiré. Entrez votre adresse E-mail pour recevoir un lien valide.', 'alert-danger', 5000);
      this._router.navigate([ '/forgot-password' ]);
    }
  }

}
