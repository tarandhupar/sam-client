import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { routing } from './ui-kit-demo.route';
import { SamUIKitModule } from 'sam-ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { UIKitDemoPage } from './ui-kit-demo.page';
import { SimpleFormDemoPage } from './simple-form-demo.page';
import { AppComponentsModule } from '../../app-components/app-components.module';
import { SampleFormModule } from './sample-complex-form/sample-form.module';
import { AlertsModule } from '../../alerts/alerts.module';
import { HelpModule } from '../../Help/help.module';

import { CountryServiceDirective } from './country-demo';
import { StateServiceDirective } from './state-demo';
import { CountyServiceDirective } from './county-demo';

@NgModule({
  imports: [
    routing,
    BrowserModule,
    RouterModule,
    FormsModule,
    SamUIKitModule,
    SamAPIKitModule,
    AppComponentsModule,
    AlertsModule,
    HelpModule,
    SampleFormModule,
  ],
  exports: [
    CountryServiceDirective,
    StateServiceDirective,
    CountyServiceDirective
  ],
  declarations: [
    UIKitDemoPage,
    SimpleFormDemoPage,
    CountryServiceDirective,
    StateServiceDirective,
    CountyServiceDirective
  ],
  providers: [],
})
export class UIKitDemoModule { }
