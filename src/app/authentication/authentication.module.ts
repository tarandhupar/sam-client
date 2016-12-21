import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Routing } from './authentication.route';

import { SamAPIKitModule } from '../../api-kit/api-kit.module';
import { SamUIKitModule } from '../../ui-kit/ui-kit.module';
import { AppComponentsModule } from '../../app/app-components/app-components.module';

import { LoginComponent } from './login';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    Routing,
    SamAPIKitModule,
    SamUIKitModule,
    AppComponentsModule
  ],

  providers: [],
  declarations: [
    /**
     * Login
     */
    LoginComponent
  ]
})
export class AuthenticationModule {
  //TODO
}
