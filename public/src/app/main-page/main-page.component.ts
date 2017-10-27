import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

/**
 * Home page
 * @author Paul GUINARD
 * @export MainPageComponent
 * @class MainPageComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: [ './main-page.component.css' ]
})
export class MainPageComponent implements OnInit {
  foods = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];

  checked = false;
  indeterminate = false;
  align = 'start';
  disabled = false;

  email = new FormControl('', [ Validators.required, Validators.email ]);

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }

  constructor() { }

  ngOnInit() {
  }

}
