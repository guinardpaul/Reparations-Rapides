import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FlashMsgService } from '../../../shared/services/flash-msg.service';
import { CompteService } from '../../../compte/compte.service';
import { EmailService } from '../../../shared/services/email.service';
import { Email } from '../../../shared/models/Email';
import { User } from '../../../shared/models/User';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: [ './forgot-password.component.css' ]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  requestSubmitted: boolean;
  emailUrl: string;
  adresseEmail: string;
  processing: boolean;
  user: User;

  get email(): string { return this.forgotPasswordForm.get('email').value as string; }

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

  createForm() {
    this.forgotPasswordForm = this._fb.group({
      email: [ '', Validators.compose([
        Validators.required
      ]) ]
    });
  }

  getUserInfos(email: string) {
    this._compteService.getUserByEmail(email)
      .subscribe(user => {
        this.user = user.obj;
      }, err => console.log(err)
      );
  }

  forgotPassword() {
    this.processing = true;
    this.adresseEmail = this.email;
    this.getUserInfos(this.email);

    setTimeout(() => {
      const mailBody = `
      <h3>Bonjour ${this.user.nom} ${this.user.prenom}.</h3>
      Cliquez sur le lien suivant pour réinitialiser votre mot de passe : <br/>
      <a href="http://localhost:4200/compte/init-password/${this.email}">Réinitialiser le mot de passe.</a>
      `;
      const mail: Email = {
        to: this.adresseEmail,
        subject: 'Mot de passe oublié ?',
        text: mailBody
      };

      this._emailService.sendMail(mail)
        .subscribe(
        data => {
          console.log(data);
          this._flashMsg.displayMsg(`Message envoyé à ${this.adresseEmail}. Consulter votre boîte de réception`, 'alert-success', 1500);
          this.requestSubmitted = true;
        },
        err => {
          console.log(err);
          this._flashMsg.displayMsg('Erreur durant l\'envoi, réessayer plus tard', 'alert-danger', 1500);
          this.processing = false;
        });
    }, 1000);

    this.processing = false;
  }

  ngOnInit() {
  }

}
