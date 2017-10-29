import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// Services
import { AuthenticationService } from '../../services/authentication.service';
import { FlashMsgService } from '../../../shared/services/flash-msg.service';
import { EmailService } from '../../../shared/services/email.service';
import { CompteService } from '../../../compte/compte.service';
import { ValidationService } from '../../services/validation.service';
import { UserService } from '../../services/user.service';
// Models
import { Email } from '../../../shared/models/Email';
import { User } from '../../../shared/models/User';
import { RegisterUserCompte } from '../../../shared/models/RegisterUserCompte';
// Templates
import * as mailTemplate from '../../../shared/models/template-email';

/**
 * Création Compte utilisateur
 * @author Paul GUINARD
 * @export RegisterComponent
 * @class RegisterComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent implements OnInit {
  private registerForm: FormGroup;
  private user: User;
  private registerData: RegisterUserCompte;
  private processing: boolean;
  private verifEmailUnicite: boolean;

  private get nom() { return this.registerForm.get('nom').value as string; }
  private get prenom() { return this.registerForm.get('prenom').value as string; }
  private get email() { return this.registerForm.get('email').value as string; }
  private get numTel() { return this.registerForm.get('numTel').value as string; }
  private get passwords() { return this.registerForm.controls[ 'passwords' ] as FormControl; }
  private get password() { return this.passwords.get('password').value as string; }
  private get confirmPassword() { return this.passwords.get('confirmPassword').value as string; }
  private get adresse() { return this.registerForm.controls[ 'adresse' ] as FormControl; }
  private get rue() { return this.adresse.get('rue').value as string; }
  private get complementAdresse() { return this.adresse.get('complementAdresse').value as string; }
  private get cp() { return this.adresse.get('cp').value as string; }
  private get ville() { return this.adresse.get('ville').value as string; }

  /**
   * Creates an instance of RegisterComponent.
   * @param {FormBuilder} _fb Reactive Form Builder
   * @param {AuthenticationService} _authService Authentication
   * @param {EmailService} _emailService Email
   * @param {FlashMsgService} _flashMsg Flash Msg
   * @param {CompteService} _compteService Compte utilisateur
   * @param {UserService} _userService User service
   * @param {ValidationService} _validationService Validation Form Function
   * @param {Router} _router router
   * @memberof RegisterComponent
   */
  constructor(
    private _fb: FormBuilder,
    private _authService: AuthenticationService,
    private _emailService: EmailService,
    private _flashMsg: FlashMsgService,
    private _compteService: CompteService,
    private _userService: UserService,
    private _validationService: ValidationService,
    private _router: Router
  ) {
    this.createForm();
    this.user = new User();
    this.processing = false;
    this.verifEmailUnicite = false;
  }

  /**
   * Generate registerForm
   *
   * @memberof RegisterComponent
   */
  createForm() {
    this.registerForm = this._fb.group({
      nom: [ '', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]) ],
      prenom: [ '', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]) ],
      email: [ '', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        this._validationService.emailValidation
      ]) ],
      numTel: [ '', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(40),
        this._validationService.numTelValidation
      ]) ],
      adresse: this._fb.group({
        rue: [ '', Validators.compose([
          Validators.required,
          Validators.maxLength(300)
        ]) ],
        complementAdresse: [ '', Validators.compose([
          Validators.required,
          Validators.maxLength(150)
        ]) ],
        cp: [ '', Validators.compose([
          Validators.minLength(2),
          Validators.maxLength(20)
        ]) ],
        ville: [ '', Validators.compose([
          Validators.required,
          Validators.maxLength(150)
        ]) ]
      }),
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
   * Get Error message du registerForm en fonction des Validators
   *
   * @param {string} arg current Input
   * @returns {string} Error message
   * @memberof RegisterComponent
   */
  getErrorMessage(arg: string): string {
    switch (arg) {
      case 'nom':
        return this.registerForm.controls[ 'nom' ].hasError('required') ? 'Ce champ est requis' :
          '';

      case 'prenom':
        return this.registerForm.controls[ 'prenom' ].hasError('required') ? 'Ce champ est requis' :
          '';

      case 'email':
        return this.registerForm.controls[ 'email' ].hasError('required') ? 'Ce champ est requis' :
          this.registerForm.controls[ 'email' ].hasError('emailValidation') ? 'Email invalide' :
            '';

      case 'numTel':
        return this.registerForm.controls[ 'numTel' ].hasError('required') ? 'Ce champ est requis' :
          this.registerForm.controls[ 'numTel' ].hasError('numTelValidation') ? 'Téléphone invalide' :
            '';

      case 'rue':
        return this.adresse.get('rue').hasError('required') ? 'Ce champ est requis' :
          '';

      case 'complementAdresse':
        return this.adresse.get('complementAdresse').hasError('required') ? 'Ce champ est requis' :
          '';

      case 'cp':
        return this.adresse.get('cp').hasError('required') ? 'Ce champ est requis' :
          '';

      case 'ville':
        return this.adresse.get('ville').hasError('required') ? 'Ce champ est requis' :
          '';

      case 'password':
        return this.passwords.get('password').hasError('required') ? 'Ce champ est requis' :
          '';

      case 'confirmPassword':
        return this.passwords.get('confirmPassword').hasError('required') ? 'Ce champ est requis' :
          '';

      case 'passwords':
        return this.passwords.hasError('comparePasswords') ? 'Les mots de passe ne sont pas identiques' :
          '';

      default:
        break;
    }
  }

  /**
   * Register Compte utilisateur function.
   * - Set User Object
   * - Appel function register du authService
   * - Envoi un email de validation on success
   *
   * @memberof RegisterComponent
   */
  onRegister() {
    this.processing = true;
    // Set User Object
    this.registerData = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      numTel: this.numTel,
      password: this.password,
      adresse: {
        rue: this.rue,
        complementAdresse: this.complementAdresse,
        cp: this.cp,
        ville: this.ville
      }
    };

    // Appel function register()
    this._authService.register(this.registerData)
      .subscribe(data => {
        console.log('register...');
        console.log(data);
        // Get Compte infos
        this.getCompteInfos(data.obj.compte);
      }, err => {
        this.processing = false;
        console.log(err);
      });
  }

  getCompteInfos(compteId: number) {
    this._compteService.getCompteById(compteId)
      .subscribe(data => {
        console.log(data);
        // Envoi l'email de validtion
        this.sendEmailValiderCompte(data.obj);
      }, err => {
        this.processing = false;
        console.log(err);
      });
  }

  /**
   * Envoi Email de validation de compte. Appelé par onRegister() => success
   * - Get le template d'email "validation compte" dans mailTemplate
   * - Set Email Object
   * - Appel function sendMail du emailService
   * - redirect to login page on success
   *
   * @param {User} user User précédemment registered dans database
   * @memberof RegisterComponent
   */
  sendEmailValiderCompte(user: User) {
    // Get email Template validation compte
    const mailBody = mailTemplate.validateAccount(user);
    // Set Email Object
    const mail: Email = {
      to: user.email,
      subject: 'Vérification du compte',
      text: mailBody
    };

    // Appel function sendMail()
    this._emailService.sendMail(mail)
      .subscribe(
      data => {
        console.log(data);

        // Redirect to login page
        this._router.navigate([ '/login' ]);
        this._flashMsg.displayMsg(`Création de compte avec succès. Un Email a été envoyé à l'adresse ${user.email}`, 'alert-success', 3000);
      },
      err => {
        console.log(err);
        this._flashMsg.displayMsg('Erreur durant la création du compte, réessayer plus tard', 'alert-danger', 3000);
        this.processing = false;
      });
  }

  /**
   * Méthode pour vérifier l'unicité de l'email.
   * Propose de redirect page login si l"email existe déjà
   *
   * @returns {boolean} verifEmailUnicite
   * @memberof RegisterComponent
   */
  checkEmailUnicite(): boolean {
    // Init boolean
    this.verifEmailUnicite = false;

    if (this.email !== '') {
      this._userService.checkEmailUnicite(this.email)
        .subscribe(data => {
          // Si data.success => Compte utilisateur existe déjà
          if (!data.success) {
            this.verifEmailUnicite = true;
          }
        }, err => console.log(err)
        );

      return this.verifEmailUnicite;
    }
  }

  /**
   * Méthode appelée quand checkEmailUnicite return true.
   * Set l'input email de la page login
   *
   * @memberof RegisterComponent
   */
  onLogin() {
    localStorage.setItem('init-password', this.email);
  }

  ngOnInit() {
  }

}
