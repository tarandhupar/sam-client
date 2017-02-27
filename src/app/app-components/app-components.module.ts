// Angular Dependencies
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SamUIKitModule } from 'ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AgencyPickerComponent } from './agency-picker/agency-picker.component';
import { DisplayPageComponent } from './display-page/display-page.component';
import { HistoryComponent } from "./history/history.component";
import { SearchLayoutComponent } from './search-layout/search-layout.component';
import { ListResultsMessageComponent } from './list-results-message/list-results-message.component';
import { WorkspaceLayoutComponent } from './workspace-layout/workspace-layout.component';
import { SamFooterComponent } from './footer/footer.component';
import { SamHeaderLinksComponent } from './header-links/header-links.component';
import { InputAutocompleteComponent } from './input-autocomplete/input-autocomplete.component';




/**
 * A module for reusable SAM Web Design components
 */
@NgModule({
  declarations: [
    AgencyPickerComponent,
    DisplayPageComponent,
    HistoryComponent,
    SearchLayoutComponent,
    WorkspaceLayoutComponent,
    SamFooterComponent,
    SamHeaderLinksComponent,
    InputAutocompleteComponent,
    ListResultsMessageComponent,
  ],
  imports: [
    BrowserModule,
    SamUIKitModule,
    FormsModule,
    RouterModule,
    SamAPIKitModule
  ],
  exports: [
    AgencyPickerComponent,
    DisplayPageComponent,
    HistoryComponent,
    SearchLayoutComponent,
    WorkspaceLayoutComponent,
    SamFooterComponent,
    SamHeaderLinksComponent,
    InputAutocompleteComponent,
    ListResultsMessageComponent,
  ],
  providers: [ ]
})
export class AppComponentsModule { }
