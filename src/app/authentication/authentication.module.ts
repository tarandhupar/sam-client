import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SamAPIKitModule } from '../../api-kit/api-kit.module';
import { SamUIKitModule } from '../../ui-kit/ui-kit.module';
import { AppComponentsModule } from '../../app/app-components/app-components.module';

import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AuthenticationRouter } from './authentication.route';
import { ProfileGuard } from './profile/profile.guard';

import { PasswordComponent } from './shared';
import { LoginComponent } from './login';
import { ProfileComponent, DetailsComponent } from './profile';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SamAPIKitModule,
    SamUIKitModule,
    AppComponentsModule,
    AuthenticationRouter
  ],

  declarations: [
    /**
     * Shared
     */
    PasswordComponent,

    /**
     * Login
     */
    LoginComponent,

    /**
     * Profile
     */
    ProfileComponent,
    DetailsComponent
  ],

  providers: [
    CookieService,
    ProfileGuard
  ]
})
export class AuthenticationModule {
  //TODO
}
