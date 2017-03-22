// Angular Dependencies
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SamUIKitModule } from 'sam-ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AgencyPickerComponent } from './agency-picker/agency-picker.component';
import { SamSearchHeaderComponent } from './search-header/search-header.component';
import { SamWellComponent } from './well/well.component';
import { SamSectionComponent } from './section/section.component';
import { SamSubSectionComponent } from './subsection/subsection.component';
import { SamTitleSectionComponent } from './title-section/title-section.component';
import { DisplayPageComponent } from './display-page/display-page.component';
import { SearchLayoutComponent } from './search-layout/search-layout.component';
import { ListResultsMessageComponent } from './list-results-message/list-results-message.component';
import { WorkspaceLayoutComponent } from './workspace-layout/workspace-layout.component';
import { SamFooterComponent } from './footer/footer.component';
import { SamFeedbackComponent } from './feedback-form/feedback-form.component';
import { SamHeaderLinksComponent } from './header-links/header-links.component';
import { InputAutocompleteComponent } from './input-autocomplete/input-autocomplete.component';
import { SamSearchbarComponent } from './searchbar/searchbar.component';
import { FormFieldComponent } from "./object-form/form-field/form-field.component";
import { ObjectFormModel } from "./object-form/object-form.component";
import { ObjectSidebarComponent } from "./object-form/object-sidebar/object-sidebar.component";

/**
 * A module for reusable SAM Web Design components
 */
@NgModule({
  declarations: [
    AgencyPickerComponent,
    SamSearchHeaderComponent,
    SamWellComponent,
    SamSectionComponent,
    SamSubSectionComponent,
    SamTitleSectionComponent,
    DisplayPageComponent,
    SearchLayoutComponent,
    WorkspaceLayoutComponent,
    SamFooterComponent,
    SamHeaderLinksComponent,
    InputAutocompleteComponent,
    ListResultsMessageComponent,
    FormFieldComponent,
    ObjectFormModel,
    ObjectSidebarComponent,
    SamSearchbarComponent,
    SamFeedbackComponent
  ],
  imports: [
    BrowserModule,
    SamUIKitModule,
    FormsModule,
    RouterModule,
    SamAPIKitModule,
    ReactiveFormsModule
  ],
  exports: [
    AgencyPickerComponent,
    SamSearchHeaderComponent,
    SamWellComponent,
    SamSectionComponent,
    SamSubSectionComponent,
    SamTitleSectionComponent,
    DisplayPageComponent,
    SearchLayoutComponent,
    WorkspaceLayoutComponent,
    SamFooterComponent,
    SamHeaderLinksComponent,
    InputAutocompleteComponent,
    ListResultsMessageComponent,
    SamSearchbarComponent,
    SamFeedbackComponent,
    FormFieldComponent,
    ObjectFormModel,
    ObjectSidebarComponent
  ],
  providers: [
    SamFeedbackComponent
  ]
})
export class AppComponentsModule { }
