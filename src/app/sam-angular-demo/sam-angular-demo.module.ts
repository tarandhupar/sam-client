import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { routing } from './sam-angular-demo.route';
import { SamUIKitModule } from 'ui-kit/ui-kit.module';
import { SamAPIKitModule } from 'api-kit/api-kit.module';
import {SamAngularDemoComponent} from "./sam-angular-demo.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    routing,
    BrowserModule,
    RouterModule,
    FormsModule,
    SamUIKitModule,
    SamAPIKitModule,
  ],
  exports: [],
  declarations: [
    SamAngularDemoComponent
  ],
  providers: [],
})
export class SamAngularDemoModule { }
