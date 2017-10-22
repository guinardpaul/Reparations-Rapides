import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Services
import { AuthenticationService } from '../../services/authentication.service';

// Models
import { User } from '../../../shared/models/User';

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
  private user: User;
  private processing: boolean;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthenticationService,
    private _router: Router
  ) {
    this.createForm();
    this.user = new User();
    this.processing = false;
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
        Validators.maxLength(100)
      ]) ],
      numTel: [ '', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10)
      ]) ],
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

  onRegister() {
    this.user = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      numTel: this.numTel,
      password: this.password
    };

    this._authService.register(this.user)
      .subscribe(data => {
        console.log('register...');
        console.log(data);
      }, err => {
        console.log(err);
      });
  }

  ngOnInit() {
  }

}
