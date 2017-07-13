import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SamAPIKitModule } from 'api-kit';
import { SamUIKitModule } from 'sam-ui-kit';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { AppComponentsModule } from '..//app-components/app-components.module';
import { PipesModule } from '../app-pipes/app-pipes.module';

import { AuthenticationService } from './authentication.service.ts';
import { AuthenticationRouter } from './authentication.route';

// Page Components
import { LoginComponent } from './login';
import { RegisterGuard, RegisterComponent, RegisterInitialComponent, RegisterConfirmComponent, RegisterMainComponent } from './register';
import { ForgotComponent, ForgotInitialComponent, ForgotConfirmComponent, ForgotMainComponent } from './forgot';
import { ProfileGuard, ProfileResolve, ProfileComponent,DetailsComponent, ResetComponent, MigrationsComponent } from './profile';

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
    AuthenticationRouter,
  ],

  declarations: [
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
  ],

  providers: [
    AuthenticationService,

    /**
     * Router Guards
     */
    ProfileGuard,
    RegisterGuard,

    /**
     * Route Resolvers
     */
    ProfileResolve
  ]
})
export class AuthenticationModule { }
