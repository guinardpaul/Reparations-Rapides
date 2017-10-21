import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EmailService } from '../../../shared/services/email.service';
import { Email } from '../../../shared/models/Email';

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

  get email(): string { return this.forgotPasswordForm.get('email').value as string; }

  constructor(
    private _emailService: EmailService,
    private _fb: FormBuilder
  ) {
    this.requestSubmitted = false;
    this.createForm();
  }

  createForm() {
    this.forgotPasswordForm = this._fb.group({
      email: [ '', Validators.compose([
        Validators.required
      ]) ]
    });
  }

  forgotPassword() {
    this.adresseEmail = this.email;
    const mailBody = 'Salut de l\'appli';
    const mail: Email = {
      to: this.email,
      subject: 'Mot de passe oublié ?',
      text: mailBody
    };
    this._emailService.sendMail(mail)
      .subscribe(
      data => console.log(data),
      err => console.log(err)
      );

    this.requestSubmitted = true;
  }

  ngOnInit() {
  }

}
