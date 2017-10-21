import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlashMessagesModule } from 'angular2-flash-messages';

// Modules
import { RoutingModule } from './routing/routing.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { CompteModule } from './compte/compte.module';

// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './routing/navbar/navbar.component';
import { AboutComponent } from './about/about.component';

// Services
import { AuthenticationService } from './authentication/services/authentication.service';
import { CompteService } from './compte/compte.service';
import { FlashMsgService } from './shared/services/flash-msg.service';
import { MainPageComponent } from './main-page/main-page.component';
import { EmailService } from './shared/services/email.service';

// Guards
import { AuthGuard } from './routing/guards/auth.guard';
import { NotAuthGuard } from './routing/guards/not-auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    NavbarComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    AuthenticationModule,
    CompteModule,
    FlashMessagesModule
  ],
  providers: [
    FlashMsgService,
    AuthenticationService,
    CompteService,
    AuthGuard,
    NotAuthGuard,
    EmailService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
