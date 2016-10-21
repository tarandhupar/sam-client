// Angular Dependencies
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SamSpace } from "./sam-space";
import { SamAccordions } from "./sam-accordions";

/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
    SamSpace,
    SamAccordions
  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    SamSpace,
    SamAccordions
  ],
  providers: [ ]
})
export class SamAngularModule { }
