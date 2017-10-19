import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  exports: [
    LoginComponent,
    RegisterComponent
  ]
})
export class AuthenticationModule { }
