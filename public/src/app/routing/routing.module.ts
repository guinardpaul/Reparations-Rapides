import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Components
import { LoginComponent } from '../authentication/components/login/login.component';
import { RegisterComponent } from '../authentication/components/register/register.component';
import { AboutComponent } from '../about/about.component';
import { CompteComponent } from '../compte/components/compte.component';
import { MainPageComponent } from '../main-page/main-page.component';
import { ForgotPasswordComponent } from '../authentication/components/forgot-password/forgot-password.component';
import { InitPasswordComponent } from '../authentication/components/init-password/init-password.component';
// Guards
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/not-auth.guard';

const appRoutes: Routes = [
  { path: 'home', component: MainPageComponent },
  { path: 'login', component: LoginComponent, canActivate: [ NotAuthGuard ] },
  { path: 'register', component: RegisterComponent, canActivate: [ NotAuthGuard ] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [ NotAuthGuard ] },
  { path: 'about', component: AboutComponent },
  { path: 'compte', component: CompteComponent, canActivate: [ AuthGuard ] },
  { path: 'compte/init-password/:email', component: InitPasswordComponent, canActivate: [ NotAuthGuard ] },
  { path: 'compte/init-password', component: InitPasswordComponent, canActivate: [ NotAuthGuard ] },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule,
  ]
})

export class RoutingModule { }
