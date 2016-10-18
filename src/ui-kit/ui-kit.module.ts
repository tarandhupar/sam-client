// Angular Dependencies
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// Sam Angular Exports
import { SamSelectComponent } from './select';
import { SamCheckboxComponent } from "./checkbox";
import { LabelWrapper } from './wrapper/label-wrapper.component';
import { FieldsetWrapper } from './wrapper/fieldset-wrapper.component';
import { SamRadioButtonComponent } from "./radiobutton/radiobutton.component";
import { SamHeaderComponent } from './header/header.component';
import {SamSearchbarComponent} from "./searchbar/searchbar.component";
import {SamBannerComponent} from "./banner/banner.component";
import {SamStickyComponent} from "./sticky/sticky.component";


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
