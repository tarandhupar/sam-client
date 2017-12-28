import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SamAPIKitModule } from 'api-kit';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { AppComponentsModule } from 'app-components/app-components.module';

import { RecoveryRouter } from './recovery.route';

import { ForgotComponent, ForgotComponents } from '.';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SamAPIKitModule,
    SamUIKitModule,
    AppComponentsModule,
    RecoveryRouter,
  ],

  declarations: [
    ForgotComponent,
    ForgotComponents,
  ],
})
export class RecoveryModule { }
