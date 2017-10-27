import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

/**
 * Form Validation function
 * @author Paul GUINARD
 * @export ValidationService
 * @class ValidationService
 */
@Injectable()
export class ValidationService {

  constructor() { }

  /**
   * Email validation
   *
   * @param {FormControl} controls input control
   * @returns emailValidation
   * @memberof ValidationService
   */
  // TODO: tslint avec join()
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

  /**
   * NumTel validation
   *
   * @param {FormControl} controls input control
   * @returns numTelValidation
   * @memberof ValidationService
   */
  numTelValidation(controls: FormControl) {
    const regExp = new RegExp(/[0-9-_.]+$/);
    if (regExp.test(controls.value)) {
      return null;
    }
    return {
      numTelValidation: true
    };
  }

  /**
   * Compare passwords validation
   *
   * @param {FormGroup} group form group
   * @returns comparePasswords
   * @memberof ValidationService
   */
  comparePasswords(group: FormGroup) {
    if (group.value.password !== group.value.confirmPassword) {
      return {
        comparePasswords: true
      };
    }
    return null;
  }

}
