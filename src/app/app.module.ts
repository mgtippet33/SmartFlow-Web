import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './components/header/app-header.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EventViewPageComponent } from './pages/eventViewPage/eventViewPage.component';
import { LocationPageComponent } from './pages/location-page/location-page.component';
import { ItemPageComponent } from './pages/item-page/item-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { QRCodeModule } from 'angular2-qrcode';
import { ItemQrcodePageComponent } from './pages/item-qrcode-page/item-qrcode-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WelcomePageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    EventPageComponent,
    EventViewPageComponent,
    LocationPageComponent,
    ItemPageComponent,
    ProfilePageComponent,
    ItemQrcodePageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    QRCodeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
