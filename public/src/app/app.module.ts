import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // TODO: A enlever quand component main-page aura son propre module
// Modules
import { RoutingModule } from './routing/routing.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { CompteModule } from './compte/compte.module';
import { MaterialModule } from './shared/material.module';
// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './routing/navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { MainPageComponent } from './main-page/main-page.component';
// Services
import { AuthenticationService } from './authentication/services/authentication.service';
import { CompteService } from './compte/compte.service';
import { FlashMsgService } from './shared/services/flash-msg.service';
import { EmailService } from './shared/services/email.service';
import { ValidationService } from './authentication/services/validation.service';
// Guards
import { AuthGuard } from './routing/guards/auth.guard';
import { NotAuthGuard } from './routing/guards/not-auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    NavbarComponent,
    MainPageComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    RoutingModule,
    AuthenticationModule,
    CompteModule,
    FlashMessagesModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    FlashMsgService,
    AuthenticationService,
    CompteService,
    AuthGuard,
    NotAuthGuard,
    EmailService,
    ValidationService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
