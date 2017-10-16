import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { routing } from './ui-kit-demo.route';
import { SamUIKitModule } from 'sam-ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { UIKitDemoPage, TestACDirective } from './ui-kit-demo.page';
import { SimpleFormDemoPage } from './simple-form-demo.page';
import { AppComponentsModule } from '../../app-components/app-components.module';
import { AlertsModule } from '../../alerts/alerts.module';
import { HelpModule } from '../../Help/help.module';

import { CountyServiceDirective } from './county-demo';

@NgModule({
  imports: [
    routing,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SamUIKitModule,
    SamAPIKitModule,
    AppComponentsModule,
  ],
  exports: [
    CountyServiceDirective,
    TestACDirective
  ],
  declarations: [
    UIKitDemoPage,
    SimpleFormDemoPage,
    CountyServiceDirective,
    TestACDirective
  ],
  providers: [],
})
export class UIKitDemoModule { }
