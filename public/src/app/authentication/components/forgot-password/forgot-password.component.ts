import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Services
import { FlashMsgService } from '../../../shared/services/flash-msg.service';
import { CompteService } from '../../../compte/compte.service';
import { EmailService } from '../../../shared/services/email.service';
// Models
import { Email } from '../../../shared/models/Email';
import { User } from '../../../shared/models/User';
// Templates
import * as mailTemplate from '../../../shared/models/template-email';

/**
 * Forgot Password du Compte utilisateur
 * @author Paul GUINARD
 * @export ForgotPasswordComponent
 * @class ForgotPasswordComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: [ './forgot-password.component.css' ]
})
export class ForgotPasswordComponent implements OnInit {
  private forgotPasswordForm: FormGroup;
  private requestSubmitted: boolean;
  private emailUrl: string;
  private adresseEmail: string;
  private processing: boolean;
  private user: User;

  private get email(): string { return this.forgotPasswordForm.get('email').value as string; }

  /**
   * Creates an instance of ForgotPasswordComponent.
   * @param {EmailService} _emailService Email
   * @param {CompteService} _compteService Compte utilisateur
   * @param {FlashMsgService} _flashMsg Flash Msg
   * @param {FormBuilder} _fb Reactive Form Builder
   * @memberof ForgotPasswordComponent
   */
  constructor(
    private _emailService: EmailService,
    private _compteService: CompteService,
    private _flashMsg: FlashMsgService,
    private _fb: FormBuilder
  ) {
    this.requestSubmitted = false;
    this.processing = false;
    this.createForm();
    this.user = new User();
  }

  /**
   * Generate forgotPasswordForm
   *
   * @memberof ForgotPasswordComponent
   */
  createForm() {
    this.forgotPasswordForm = this._fb.group({
      email: [ '', Validators.compose([
        Validators.required
      ]) ]
    });
  }

  /**
   * Get User by Email. Appelé par forgotPassword()
   *
   * @param {string} email email
   * @memberof ForgotPasswordComponent
   */
  getUserByEmail(email: string) {
    this._compteService.getCompteByEmail(email)
      .subscribe(user => {
        this.user = user.obj;
      }, err => console.log(err)
      );
  }

  /**
   * Send forgotPassword mail pour réinitialiser le password.
   * - Appel fonction getUserByEmail()
   * - Envoi Email de réinitialisation du password
   *
   * @memberof ForgotPasswordComponent
   */
  forgotPassword() {
    this.processing = true;
    this.adresseEmail = this.email;
    this.getUserByEmail(this.email);

    setTimeout(() => {
      const mailBody = mailTemplate.forgotPassword(this.user);
      const mail: Email = {
        to: this.adresseEmail,
        subject: 'Mot de passe oublié ?',
        text: mailBody
      };

      this._emailService.sendMail(mail)
        .subscribe(
        data => {
          console.log(data);
          this.requestSubmitted = true;
          this.processing = false;
        },
        err => {
          console.log(err);
          this._flashMsg.displayMsg('Erreur durant l\'envoi, réessayer plus tard', 'alert-danger', 3000);
          this.processing = false;
        });
    }, 1000);

  }

  ngOnInit() {
  }

}
