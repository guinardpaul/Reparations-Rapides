import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from '../authentication/components/login/login.component';
import { RegisterComponent } from '../authentication/components/register/register.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'register', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [
    NavbarComponent
  ],
  exports: [
    RouterModule,
    NavbarComponent
  ]
})
export class RoutingModule { }
