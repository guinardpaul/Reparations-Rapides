import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable()
export class ValidationService {

  constructor() { }

  emailValidation(controls: FormControl) {
    const regExp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null;
    }
    return {
      emailValidation: true
    };
  }

  numTelValidation(controls: FormControl) {
    const regExp = new RegExp(/[0-9-_.]+$/);
    if (regExp.test(controls.value)) {
      return null;
    }
    return {
      numTelValidation: true
    };
  }

  comparePasswords(group: FormGroup) {
    if (group.value.password !== group.value.confirmPassword) {
      return {
        comparePasswords: true
      };
    }
    return null;
  }

}
