import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routing } from './error.route';
import { SamUIKitModule } from 'samUIKit';
import { SamAPIKitModule } from 'api-kit';
import { GenericErrorPage } from './error.page';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    SamUIKitModule,
    SamAPIKitModule,
    routing
  ],
  exports: [],
  declarations: [ GenericErrorPage ],
  providers: [],
})
export class ErrorModule { }
