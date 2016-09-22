// Angular Dependencies
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Sam Angular Exports
import { SamSelectComponent } from './sam-select';
import { SamCheckboxesComponent } from "./sam-checkboxes";
import { InputWrapper } from './common/input-wrapper/input-wrapper.component';
import {SamRadioButtonsComponent} from "./sam-radiobuttons/sam-radiobuttons.component";


/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [ SamSelectComponent, SamCheckboxesComponent, SamRadioButtonsComponent, InputWrapper ],
  imports: [ BrowserModule, FormsModule, HttpModule ],
  exports: [ SamSelectComponent, SamCheckboxesComponent, SamRadioButtonsComponent, InputWrapper ],
  providers: [ ]
})
export class SamAngularModule { }
