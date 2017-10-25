import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// Services
import { AuthenticationService } from '../../services/authentication.service';
import { FlashMsgService } from '../../../shared/services/flash-msg.service';
import { EmailService } from '../../../shared/services/email.service';
import { CompteService } from '../../../compte/compte.service';
import { ValidationService } from '../../services/validation.service';
// Models
import { Email } from '../../../shared/models/Email';
import { User } from '../../../shared/models/User';
// Templates
import * as mailTemplate from '../../../shared/models/template-email';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent implements OnInit {
  private registerForm: FormGroup;
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
  private user: User;
  private processing: boolean;
  private verifEmailUnicite: boolean;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthenticationService,
    private _emailService: EmailService,
    private _flashMsg: FlashMsgService,
    private _compteService: CompteService,
    private _validationService: ValidationService,
    private _router: Router
  ) {
    this.createForm();
    this.user = new User();
    this.processing = false;
    this.verifEmailUnicite = false;
  }

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
        Validators.maxLength(10),
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

  onRegister() {
    this.processing = true;
    this.user = {
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

    this._authService.register(this.user)
      .subscribe(data => {
        console.log('register...');
        console.log(data);
        this.validateAccountEmail(data.obj);
      }, err => {
        this.processing = false;
        console.log(err);
      });
  }

  validateAccountEmail(user: User) {
    const mailBody = mailTemplate.validateAccount(user);
    const mail: Email = {
      to: user.email,
      subject: 'Vérification du compte',
      text: mailBody
    };

    this._emailService.sendMail(mail)
      .subscribe(
      data => {
        console.log(data);
        this.processing = false;
        this._router.navigate([ '/login' ]);
        this._flashMsg.displayMsg(`Création de compte avec succès. Un Email a été envoyé à l'adresse ${user.email}`, 'alert-success', 3000);
      },
      err => {
        console.log(err);
        this._flashMsg.displayMsg('Erreur durant la création du compte, réessayer plus tard', 'alert-danger', 3000);
        this.processing = false;
      });
  }

  checkEmailUnicite(email: string) {
    if (email !== '') {
      this._compteService.checkEmailUnicite(email)
        .subscribe(data => {
          console.log(data);
          if (!data.success) {
            this.verifEmailUnicite = true;
          } else {
            this.verifEmailUnicite = false;
          }
        }, err => console.log(err)
        );
      console.log(this.verifEmailUnicite);
    }
  }

  onLogin() {
    localStorage.setItem('init-password', this.email);
  }

  ngOnInit() {
  }

}
