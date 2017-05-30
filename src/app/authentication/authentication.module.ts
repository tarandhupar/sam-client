import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { SamAPIKitModule } from 'api-kit';
import { SamUIKitModule } from 'sam-ui-kit';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { AppComponentsModule } from '..//app-components/app-components.module';
import { PipesModule } from '../app-pipes/app-pipes.module';

import { AuthenticationService } from './authentication.service.ts';
import { AuthenticationRouter } from './authentication.route';

// Route Guards
import { RegisterGuard } from './register/register.guard';
import { ProfileGuard } from './profile/profile.guard';
import { SystemGuard } from './system/system.guard';

// Shared Components
import { SamKBAComponent, SamPasswordComponent } from './shared';

// Page Components
import { LoginComponent } from './login';
import { RegisterComponent, RegisterInitialComponent, RegisterConfirmComponent, RegisterMainComponent } from './register';
import { ForgotComponent, ForgotInitialComponent, ForgotConfirmComponent, ForgotMainComponent } from './forgot';
import { ProfileComponent,DetailsComponent, ResetComponent, MigrationsComponent } from './profile';
import { SystemComponent, SystemProfileComponent, SystemPasswordComponent, SystemMigrationsComponent } from './system';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SamAPIKitModule,
    SamUIKitModule,
    Ng2PageScrollModule.forRoot(),
    AppComponentsModule,
    PipesModule,
    AuthenticationRouter
  ],

  declarations: [
    /**
     * Shared
     */
    SamKBAComponent,
    SamPasswordComponent,

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
     * Forgot
     */
    ForgotComponent,
    ForgotInitialComponent,
    ForgotConfirmComponent,
    ForgotMainComponent,

    /**
     * Profile
     */
    ProfileComponent,
    DetailsComponent,
    MigrationsComponent,
    ResetComponent,

    /**
     * System
     */
    SystemComponent,
    SystemProfileComponent,
    SystemPasswordComponent,
    SystemMigrationsComponent
  ],

  providers: [
    AuthenticationService,
    RegisterGuard,
    ProfileGuard,
    SystemGuard
  ]
})
export class AuthenticationModule {
  //TODO
}
