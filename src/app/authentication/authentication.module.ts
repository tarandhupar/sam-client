import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Routing } from './authentication.route';

import { SamAPIKitModule } from '../../api-kit/api-kit.module';
import { SamUIKitModule } from '../../ui-kit/ui-kit.module';
import { AppComponentsModule } from '../../app/app-components/app-components.module';

import { PasswordComponent } from './shared';

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
    PasswordComponent
  ]
})
export class AuthenticationModule {
  //TODO
}
