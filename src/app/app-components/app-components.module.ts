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
import { SamTypeAheadComponent } from "./type-ahead-multiselect/type-ahead.component";
import { FalTableComponent } from "./fal-table/fal-table.component";
import { SamCountryServiceAutoDirective } from "./location-autocomplete/country-autocomplete/country-autocomplete.component";
import { SamStateServiceAutoDirective, StateServiceImpl } from "./location-autocomplete/state-autocomplete/state-autocomplete.component";
import { SamCountyServiceAutoDirective, CountyServiceImpl } from "./location-autocomplete/county-autocomplete/county-autocomplete.component";
import { CityServiceImpl, SamCityServiceAutoDirective } from "./location-autocomplete/city-autocomplete/city-autocomplete.component";
import { AlertFooterService } from "../alerts/alert-footer/alert-footer.service";
import { OrgAddrFormComponent } from "./address-form/address-form.component";
import { PipesModule } from "../app-pipes/app-pipes.module";
import { SamFeedbackSidenavComponent } from "./feedback-sidenav/feedback-sidenav.component";
import { FeedbackFormService } from "./feedback-form/feedback-form.service";

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
    SamFeedbackComponent,
    SamFeedbackSidenavComponent,
    SamTypeAheadComponent,
    FalTableComponent,
    SamCountryServiceAutoDirective,
    SamStateServiceAutoDirective,
    SamCountyServiceAutoDirective,
    SamCityServiceAutoDirective,
    OrgAddrFormComponent,
  ],
  imports: [
    BrowserModule,
    SamUIKitModule,
    FormsModule,
    RouterModule,
    SamAPIKitModule,
    ReactiveFormsModule,
    PipesModule
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
    SamFeedbackSidenavComponent,
    FormFieldComponent,
    ObjectFormModel,
    ObjectSidebarComponent,
    SamTypeAheadComponent,
    FalTableComponent,
    SamCountryServiceAutoDirective,
    SamStateServiceAutoDirective,
    SamCountyServiceAutoDirective,
    OrgAddrFormComponent,
  ],
  providers: [
    SamFeedbackComponent,
    StateServiceImpl,
    CountyServiceImpl,
    CityServiceImpl,
    AlertFooterService,
    FeedbackFormService,
  ]
})
export class AppComponentsModule { }
