// Angular Dependencies
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SamUIKitModule } from 'ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AgencyPickerComponent } from './agency-picker/agency-picker.component';
import { DisplayPageComponent } from './display-page/display-page.component';
import { SearchLayoutComponent } from './search-layout/search-layout.component';



/**
 * A module for reusable SAM Web Design components
 */
@NgModule({
  declarations: [
    AgencyPickerComponent,
    DisplayPageComponent,
    SearchLayoutComponent
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
    SearchLayoutComponent
  ],
  providers: [ ]
})
export class AppComponentsModule { }
