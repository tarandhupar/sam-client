import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SamAPIKitModule } from 'api-kit';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { AppComponentsModule } from 'app-components/app-components.module';

import { RegistrationRouter } from './registration.route';

import { RegistrationGuard, RegisterComponent, RegisterInitialComponent, RegisterConfirmComponent, RegisterMainComponent } from '.';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SamAPIKitModule,
    SamUIKitModule,
    AppComponentsModule,
    RegistrationRouter,
  ],

  declarations: [
    RegisterComponent,
    RegisterInitialComponent,
    RegisterConfirmComponent,
    RegisterMainComponent,
  ],

  providers: [
    RegistrationGuard,
  ]
})
export class RegistrationModule { }
