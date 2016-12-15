// Angular Dependencies
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SamUIKitModule } from 'ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AgencyPickerComponent } from './agency-picker/agency-picker.component';



/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
    AgencyPickerComponent
  ],
  imports: [
    BrowserModule,
    SamUIKitModule,
    FormsModule,
    SamAPIKitModule
  ],
  exports: [
    AgencyPickerComponent
  ],
  providers: [ ]
})
export class AppComponentsModule { }
