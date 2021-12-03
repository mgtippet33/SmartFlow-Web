import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { EventViewPageComponent } from './pages/eventViewPage/eventViewPage.component';
import { ItemPageComponent } from './pages/item-page/item-page.component';
import { ItemQrcodePageComponent } from './pages/item-qrcode-page/item-qrcode-page.component';
import { LocationPageComponent } from './pages/location-page/location-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { StatisticPageComponent } from './pages/statistic-page/statistic-page.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';

const routes: Routes = [
  {path: '', component: WelcomePageComponent, data: {title: 'Welcome Page', url: '/'}},
  {path: 'login', component: LoginPageComponent, data: {title: 'Login Page', url: '/'}},
  {path: 'register', component: RegisterPageComponent, data: {title: 'Register Page', url: '/'}},
  {path: 'event', component: EventPageComponent, data: {title: 'Events Page', url: '/'}},
  {path: 'event/edit/:eventID', component: EventViewPageComponent, data: {title: 'Event Page', url: '/'}},
  {path: 'event/create', component: EventViewPageComponent, data: {title: 'Event Page', url: '/'}},
  {path: 'event/:eventID/location/create', component: LocationPageComponent, data: {title: 'Location Page', url: '/'}},
  {path: 'location/edit/:locationID', component: LocationPageComponent, data: {title: 'Location Page', url: '/'}},
  {path: 'location/:locationID/item/create', component: ItemPageComponent, data: {title: 'Item Page', url: '/'}},
  {path: 'item/edit/:itemID', component: ItemPageComponent, data: {title: 'Item Page', url: '/'}},
  {path: 'profile', component: ProfilePageComponent, data: {title: 'Account Page', url: '/'}},
  {path: 'item/qrcode/:itemID', component: ItemQrcodePageComponent, data: {title: 'Item QR Code Page', url: '/'}},
  {path: 'statistics', component: StatisticPageComponent, data: {title: 'Statistics Page', url: '/'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
