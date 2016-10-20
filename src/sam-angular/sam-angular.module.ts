// Angular Dependencies
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// Sam Angular Exports
import { SamSelectComponent } from './sam-select';
import { SamCheckboxesComponent } from "./sam-checkboxes";
import { LabelWrapper } from './common/wrappers/label-wrapper.component';
import { FieldsetWrapper } from './common/wrappers/fieldset-wrapper.component';
import { SamRadioButtonsComponent } from "./sam-radiobuttons/sam-radiobuttons.component";
import { SamHeaderComponent } from './sam-header/sam-header.component';
import {SamSearchbarComponent} from "./sam-searchbar/sam-searchbar.component";
import {SamBannerComponent} from "./sam-banner/sam-banner.component";
import {SamStickyComponent} from "./sam-sticky/sam-sticky.component";
import {SamButtonComponent} from "./sam-button/sam-button.component";
import {SamFooterComponent} from "./sam-footer/sam-footer.component";


/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({

  declarations: [ SamButtonComponent, SamFooterComponent, SamSelectComponent, SamCheckboxesComponent, SamRadioButtonsComponent, SamSearchbarComponent, SamBannerComponent, SamHeaderComponent, LabelWrapper, FieldsetWrapper, SamStickyComponent ],
  imports: [ BrowserModule, FormsModule, HttpModule, RouterModule ],
  exports: [ SamButtonComponent, SamFooterComponent, SamSelectComponent, SamCheckboxesComponent, SamRadioButtonsComponent,SamSearchbarComponent,SamBannerComponent, SamHeaderComponent, SamStickyComponent  ],
  providers: [ ]
})
export class SamAngularModule { }
