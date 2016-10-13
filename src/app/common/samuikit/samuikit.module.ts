// Angular Dependencies
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SamFooter } from "./sam-footer";
import { SamHeader } from "./sam-header";
import { SamSpace } from "./sam-space";
import { SamButton } from "./sam-button";
import { SamLabel } from "./sam-label";
import { SamAccordions } from "./sam-accordions";
import { SamSelect } from "./sam-select";


/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
    SamFooter,
    SamHeader,
    SamSpace,
    SamButton,
    SamLabel,
    SamAccordions,
    SamSelect,
  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    SamFooter,
    SamHeader,
    SamSpace,
    SamButton,
    SamLabel,
    SamAccordions,
    SamSelect,
  ],
  providers: [ ]
})
export class SamUIKitModule { }
