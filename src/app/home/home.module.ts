import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routing } from './home.route';
import { SamUIKitModule } from 'ui-kit/ui-kit.module';
import { SamAPIKitModule } from 'api-kit/api-kit.module';
import {HomeComponent} from "./home.component";

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    SamUIKitModule,
    SamAPIKitModule,
    routing
  ],
  exports: [],
  declarations: [ HomeComponent ],
  providers: [],
})
export class HomeModule { }
