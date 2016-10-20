// Angular Dependencies
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SamHeader } from "./sam-header";
import { SamSpace } from "./sam-space";
import { SamButton } from "./sam-button";
import { SamLabel } from "./sam-label";
import { SamAccordions } from "./sam-accordions";

/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
    SamHeader,
    SamSpace,
    SamButton,
    SamLabel,
    SamAccordions
  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    SamHeader,
    SamSpace,
    SamButton,
    SamLabel,
    SamAccordions
  ],
  providers: [ ]
})
export class SamAngularModule { }
