import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { SamAPIKitModule } from '../../api-kit/api-kit.module';
import { SamUIKitModule } from '../../ui-kit/ui-kit.module';
import { AppComponentsModule } from '../../app/app-components/app-components.module';

import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AuthenticationRouter } from './authentication.route';
import { RegisterGuard } from './register/register.guard';
import { ProfileGuard } from './profile/profile.guard';

import { KBAComponent, PasswordComponent } from './shared';
import { LoginComponent } from './login';
import { RegisterComponent, RegisterInitialComponent, RegisterConfirmComponent, RegisterMainComponent } from './register';
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
    KBAComponent,
    PasswordComponent,

    /**
     * Login
     */
    LoginComponent,

    /**
     * Register
     */
    RegisterComponent,
    RegisterInitialComponent,
    RegisterConfirmComponent,
    RegisterMainComponent,

    /**
     * Profile
     */
    ProfileComponent,
    DetailsComponent
  ],

  providers: [
    CookieService,
    RegisterGuard,
    ProfileGuard
  ]
})
export class AuthenticationModule {
  //TODO
}
