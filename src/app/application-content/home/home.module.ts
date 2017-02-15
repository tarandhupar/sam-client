import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routing } from './home.route';
import { AppComponentsModule } from '../../app-components/app-components.module';
import { SamUIKitModule } from 'ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { HomePage} from "./home.page";

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    AppComponentsModule,
    SamUIKitModule,
    SamAPIKitModule,
    routing
  ],
  exports: [],
  declarations: [ HomePage ],
  providers: [],
})
export class HomeModule { }
