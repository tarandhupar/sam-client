// Angular Dependencies
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SamUIKitModule } from '../../sam-ui-elements/src/ui-kit';
import { SamAPIKitModule } from '../../api-kit';
import { AgencyPickerComponent } from './agency-picker/agency-picker.component';
import { AgencyPickerV2Component } from './agency-picker-v2/agency-picker-v2.component';
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
import { SamLoginComponent } from './login/login.component';
import { SamSearchbarComponent } from './searchbar/searchbar.component';
import { FormFieldComponent } from "./object-form/form-field/form-field.component";
import { ObjectFormModel } from "./object-form/object-form.component";
import { ObjectSidebarComponent } from "./object-form/object-sidebar/object-sidebar.component";
import { FalTableComponent } from "./fal-table/fal-table.component";
import { SamCountryServiceAutoDirective } from "./location-autocomplete/country-autocomplete/country-autocomplete.component";
import { SamStateServiceAutoDirective, StateServiceImpl } from "./location-autocomplete/state-autocomplete/state-autocomplete.component";
import { SamCountyServiceAutoDirective, CountyServiceImpl } from "./location-autocomplete/county-autocomplete/county-autocomplete.component";
import { CityServiceImpl, SamCityServiceAutoDirective } from "./location-autocomplete/city-autocomplete/city-autocomplete.component";
import { OrgAddrFormComponent } from "./address-form/address-form.component";
import { PipesModule } from "../app-pipes/app-pipes.module";
import { SamFeedbackSidenavComponent } from "./feedback-sidenav/feedback-sidenav.component";
import { FeedbackFormService } from "./feedback-form/feedback-form.service";
import { SamSoloAccordian } from "./solo-accordion/solo-accordian.component";
import { SamStatusBannerComponent } from "./sam-status-banner/sam-status-banner.component";
import { SamEditorComponent } from "./editor/editor.component";
import { SamTitleSubtitleComponent } from "./title-subtitle/title-subtitle.component";
import { SamCreatePageTemplateComponent } from "./create-page-template/create-page-template.component";
import { SamComplexFormTemplateComponent } from "./complex-form-template/complex-form-template.component";
import { StickyElementComponent } from "./sticky-element/sticky-element.componet";
import { SamKBAComponent } from './kba/kba.component';
import { SamPasswordComponent } from './password/password.component';
import { SamUserDirectoryComponent } from './user-directory/user-directory.component';
import { SamDateRangeFilterComponent } from './sam-date-range-filter/sam-date-range-filter.component';
import { SamRMSUsersServiceAutoDirective, RMSUserServiceImpl} from '../users/request-access/username-autocomplete.component.ts';
import { SamSortComponent } from "./sam-sort/sam-sort.component";
import { SamNotificationsComponent } from './sam-notifications/sam-notifications.component';
import { SamListBuilderComponent } from './sam-listbuilder/sam-listbuilder.component';
import { SamListBuilderCardComponent } from './sam-listbuilder/sam-listbuilder-card.component';
import { SamListBuilderActionComponent } from './sam-listbuilder/sam-listbuilder-action.component';
import { SamWatchComponent } from './watchlist/watchlist.component';
import { AlertHeaderComponent } from './alert-header';
import { AlertFooterComponent } from './alert-footer';
import { RequestDetailsComponent } from './request-details/request-details';
import { SamLocationComponent } from './location-component';
import { SamTableEntryComponent } from './sam-table-entry/sam-table-entry.component';
import { SamPOCEntryComponent } from './poc-entry/poc-entry.component';
import { SamTableSelectComponent } from './sam-table-select/sam-table-select.component';

/**
 * A module for reusable SAM Web Design components
 */
@NgModule({
  declarations: [
    AgencyPickerComponent,
    AlertHeaderComponent,
    AlertFooterComponent,
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
    SamLoginComponent,
    ListResultsMessageComponent,
    FormFieldComponent,
    ObjectFormModel,
    ObjectSidebarComponent,
    SamSearchbarComponent,
    SamFeedbackComponent,
    SamFeedbackSidenavComponent,
    FalTableComponent,
    OrgAddrFormComponent,
    SamSoloAccordian,
    SamStatusBannerComponent,
    SamEditorComponent,
    SamTitleSubtitleComponent,
    SamCreatePageTemplateComponent,
    SamComplexFormTemplateComponent,
    StickyElementComponent,
    SamKBAComponent,
    SamPasswordComponent,
    SamUserDirectoryComponent,
    SamDateRangeFilterComponent,
    //SamRMSUsersServiceAutoDirective,
    AgencyPickerV2Component,
    SamSortComponent,
    SamNotificationsComponent,
    SamWatchComponent,
    SamListBuilderComponent,
    SamListBuilderActionComponent,
    SamListBuilderCardComponent,
    SamLocationComponent,
    RequestDetailsComponent,
    SamTableEntryComponent,
    SamPOCEntryComponent,
    SamTableSelectComponent
  ],
  imports: [
    CommonModule,
    SamUIKitModule,
    FormsModule,
    RouterModule,
    SamAPIKitModule,
    ReactiveFormsModule,
    PipesModule
  ],
  exports: [
    AgencyPickerComponent,
    AlertHeaderComponent,
    AlertFooterComponent,
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
    SamLoginComponent,
    ListResultsMessageComponent,
    SamSearchbarComponent,
    SamFeedbackComponent,
    SamFeedbackSidenavComponent,
    FormFieldComponent,
    ObjectFormModel,
    ObjectSidebarComponent,
    FalTableComponent,
    OrgAddrFormComponent,
    SamSoloAccordian,
    SamStatusBannerComponent,
    SamEditorComponent,
    SamTitleSubtitleComponent,
    SamCreatePageTemplateComponent,
    SamComplexFormTemplateComponent,
    StickyElementComponent,
    SamKBAComponent,
    SamPasswordComponent,
    SamUserDirectoryComponent,
    SamDateRangeFilterComponent,
    AgencyPickerV2Component,
    SamSortComponent,
    SamNotificationsComponent,
    SamWatchComponent,
    SamListBuilderComponent,
    RequestDetailsComponent,
    SamLocationComponent,
    SamTableEntryComponent,
    SamPOCEntryComponent,
    SamTableSelectComponent
  ],
  providers: [
    SamFeedbackComponent,
    FeedbackFormService,
    //RMSUserServiceImpl,
  ]
})
export class AppComponentsModule { }
