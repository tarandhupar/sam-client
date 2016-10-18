// Angular Dependencies
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// Sam Angular Exports
import { SamSelectComponent } from './form-controls/select';
import { SamCheckboxComponent } from "./form-controls/checkbox";
import { LabelWrapper } from './form-controls/wrapper/label-wrapper.component';
import { FieldsetWrapper } from './form-controls/wrapper/fieldset-wrapper.component';
import { SamRadioButtonComponent } from "./form-controls/radiobutton/radiobutton.component";
import { SamHeaderComponent } from './elements/header/header.component';
import {SamSearchbarComponent} from "./form-controls/searchbar/searchbar.component";
import {SamBannerComponent} from "./elements/banner/banner.component";
import {SamStickyComponent} from "./elements/sticky/sticky.component";


/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
    SamSelectComponent,
    SamCheckboxComponent,
    SamRadioButtonComponent,
    SamSearchbarComponent,
    SamBannerComponent,
    SamHeaderComponent,
    SamStickyComponent,
    LabelWrapper,
    FieldsetWrapper,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    SamSelectComponent,
    SamCheckboxComponent,
    SamRadioButtonComponent,
    SamSearchbarComponent,
    SamBannerComponent,
    SamHeaderComponent,
    SamStickyComponent
  ],
  providers: [ ]
})
export class SamUIKitModule { }
