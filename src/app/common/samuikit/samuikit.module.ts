// Angular Dependencies
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SamHeader } from "./sam-header";
import { SamSpace } from "./sam-space";
import { SamButton } from "./sam-button";
import { SamAlert } from "./sam-alert";
import { SamLabel } from "./sam-label";
<<<<<<< HEAD
import { SamSelect } from "./sam-select";

=======
import { SamAccordions } from "./sam-accordions";
>>>>>>> GSA-IAE/comp

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
<<<<<<< HEAD
    SamSelect,
=======
    SamAccordions,
>>>>>>> GSA-IAE/comp
    SamAlert,
  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    SamHeader,
    SamSpace,
    SamButton,
    SamLabel,
<<<<<<< HEAD
    SamSelect,
=======
    SamAccordions,
>>>>>>> GSA-IAE/comp
    SamAlert,
  ],
  providers: [ ]
})
export class SamAngularModule { }
