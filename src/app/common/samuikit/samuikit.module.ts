// Angular Dependencies
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SamSpace } from "./sam-space";
import { SamButton } from "./sam-button";

/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
    SamSpace,
    SamButton,

  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    SamSpace,
    SamButton,

  ],
  providers: [ ]
})
export class SamAngularModule { }
