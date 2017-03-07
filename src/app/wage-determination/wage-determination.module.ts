import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WageDeterminationPage }   from './wage-determination.page';
import { routing } from './wage-determination.route';
import { PipesModule } from '../app-pipes/app-pipes.module';

import { SamUIKitModule } from 'sam-ui-kit';
import { AppComponentsModule } from '../app-components/app-components.module';


@NgModule({
  imports: [
    PipesModule,
    BrowserModule,
    routing,
    SamUIKitModule,
    AppComponentsModule
  ],
  exports: [
    WageDeterminationPage
  ],
  declarations: [
    WageDeterminationPage
  ],
})
export class WageDeterminationModule { }
