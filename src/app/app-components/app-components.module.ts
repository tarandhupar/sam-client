// Angular Dependencies
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SamUIKitModule } from 'ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AgencyPickerComponent } from './agency-picker/agency-picker.component';
import { DisplayPageComponent } from './display-page/display-page.component';
import { SearchTemplateComponent } from './search-template/search-template.component';



/**
 * A module for reusable SAM Web Design components
 */
@NgModule({
  declarations: [
    AgencyPickerComponent,
    DisplayPageComponent,
    SearchTemplateComponent
  ],
  imports: [
    BrowserModule,
    SamUIKitModule,
    FormsModule,
    SamAPIKitModule
  ],
  exports: [
    AgencyPickerComponent,
    DisplayPageComponent,
    SearchTemplateComponent
  ],
  providers: [ ]
})
export class AppComponentsModule { }
