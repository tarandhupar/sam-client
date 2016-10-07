// Angular Dependencies
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Sam Angular Exports
import { SamSelectComponent } from './sam-select';
import { SamCheckboxesComponent } from "./sam-checkboxes";
import { LabelWrapper } from './common/wrappers/label-wrapper.component';
import { FieldsetWrapper } from './common/wrappers/fieldset-wrapper.component';
import { SamRadioButtonsComponent } from "./sam-radiobuttons/sam-radiobuttons.component";
import {SamDropdownComponent} from "./sam-dropdown/sam-dropdown.component";
import { SamHeaderComponent } from './sam-header/sam-header.component';


/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [ SamHeaderComponent, SamSelectComponent, SamCheckboxesComponent, SamRadioButtonsComponent, LabelWrapper, FieldsetWrapper, SamDropdownComponent ],
  imports: [ BrowserModule, FormsModule, HttpModule ],
  exports: [ SamSelectComponent, SamCheckboxesComponent, SamRadioButtonsComponent, SamHeaderComponent ],
  providers: [ ]
})
export class SamAngularModule { }
