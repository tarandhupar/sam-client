// Angular Dependencies
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SamUIKitModule } from 'ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AgencyPickerComponent } from './agency-picker/agency-picker.component';
import { InputAutocompleteComponent } from './input-autocomplete/input-autocomplete.component';



/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
    AgencyPickerComponent,
    InputAutocompleteComponent
  ],
  imports: [
    BrowserModule,
    SamUIKitModule,
    FormsModule,
    SamAPIKitModule
  ],
  exports: [
    AgencyPickerComponent,
    InputAutocompleteComponent
  ],
  providers: [ ]
})
export class AppComponentsModule { }
