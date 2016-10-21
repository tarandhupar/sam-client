// Angular Dependencies
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SamSpace } from "./sam-space";

/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
    SamSpace,
  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    SamSpace,
  ],
  providers: [ ]
})
export class SamAngularModule { }
