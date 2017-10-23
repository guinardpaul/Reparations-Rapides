import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// Models
import { User } from '../../../shared/models/User';
// Services
import { CompteService } from '../../../compte/compte.service';
import { FlashMsgService } from '../../../shared/services/flash-msg.service';

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

  get email(): string { return this.initPasswordForm.get('email').value as string; }
  get passwords() { return this.initPasswordForm.controls[ 'passwords' ] as FormControl; }
  get password() { return this.passwords.get('password').value as string; }
  get confirmPassword() { return this.passwords.get('confirmPassword').value as string; }

  constructor(
    private _compteService: CompteService,
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
      }, Validators.compose([
        // TODO: ajouter comparaison password validation
      ]))
    });
  }

  initPassword() {
    this.processing = false;
    const user: User = this.user;
    user.password = this.password;
    console.log(user);

    this._compteService.initUserPassword(user)
      .subscribe(data => {
        if (data.success) {
          this._flashMsg.displayMsg('Mot de passe mis à jour. Vous pouvez vous connecter avec votre nouveau password.',
            'alert-success', 3000);
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

  getUserInfos(email: string) {
    this._compteService.getUserByEmail(email)
      .subscribe(user => {
        this.user = user.obj;
      }, err => {
        console.log(err);
      });
  }

  ngOnInit() {
    if (this._activatedRoute.snapshot.params[ 'email' ] !== undefined) {
      this.userEmail = this._activatedRoute.snapshot.params[ 'email' ];
      this.initPasswordForm.get('email').setValue(this.userEmail);
      this.getUserInfos(this.userEmail);
    } else {
      this._flashMsg.displayMsg('Ce lien a expiré. Entrez votre adresse E-mail pour recevoir un lien valide.', 'alert-danger', 5000);
      this._router.navigate([ '/forgot-password' ]);
    }
  }

}
