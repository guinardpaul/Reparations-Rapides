import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Modules
import { RoutingModule } from './routing/routing.module';
import { AuthenticationModule } from './authentication/authentication.module';

// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './routing/navbar/navbar.component';

// Services
import { AuthenticationService } from './authentication/services/authentication.service';
import { AboutComponent } from './about/about.component';
import { CompteComponent } from './compte/compte.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    CompteComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    AuthenticationModule
  ],
  providers: [
    AuthenticationService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
