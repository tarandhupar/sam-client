import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Routing } from './authentication.route';

import { SamAPIKitModule } from '../../api-kit/api-kit.module';
import { SamUIKitModule } from '../../ui-kit/ui-kit.module';
import { AppComponentsModule } from '../../app/app-components/app-components.module';

import { KBAComponent } from './shared';
import { PasswordComponent } from './shared';

import { LoginComponent } from './login';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    Routing,
    SamAPIKitModule,
    SamUIKitModule,
    AppComponentsModule
  ],

  providers: [],
  declarations: [
    /**
     * Shared
     */
    KBAComponent,
    PasswordComponent,

    /**
     * Login
     */
    LoginComponent
  ]
})
export class AuthenticationModule {
  //TODO
}
