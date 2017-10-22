import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../../shared/models/User';
import { CompteService } from '../../../compte/compte.service';

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
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute
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
    const user: User = this.user;
    user.password = this.password;


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
      console.log('Email not provided');
    }
  }

}
