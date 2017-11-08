// Angular Dependencies
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { SamAPIKitModule } from '../../api-kit';
import { AgencyPickerComponent } from './agency-picker/agency-picker.component';
import { AgencyPickerV2Component } from './agency-picker-v2/agency-picker-v2.component';
import { ListResultsMessageComponent } from './list-results-message/list-results-message.component';
import { SamFooterComponent } from './footer/footer.component';
import { SamFeedbackComponent } from './feedback-form/feedback-form.component';
import { SamHeaderLinksComponent } from './header-links/header-links.component';
import { SamLoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { SamSearchbarComponent } from './searchbar/searchbar.component';
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
import { SamChipsComponent } from './sam-chips/sam-chips.component';
import { SamTabDateRangeFilterComponent } from './sam-tab-date-range/sam-tab-date-range.component';
import { SamSelectDateRangeFilterComponent } from './sam-select-date-range/sam-select-date-range-filter.component';

/**
 * A module for reusable SAM Web Design components
 */
@NgModule({
  declarations: [
    AgencyPickerComponent,
    AlertHeaderComponent,
    AlertFooterComponent,
    SamFooterComponent,
    SamHeaderLinksComponent,
    SamLoginComponent,
    ListResultsMessageComponent,
    SamSearchbarComponent,
    SamFeedbackComponent,
    SamFeedbackSidenavComponent,
    OrgAddrFormComponent,
    SamSoloAccordian,
    SamStatusBannerComponent,
    SamEditorComponent,
    SamTitleSubtitleComponent,
    SamCreatePageTemplateComponent,
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
    SamTableSelectComponent,
    SamChipsComponent,
    SamTabDateRangeFilterComponent,
    SamSelectDateRangeFilterComponent,
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
    SamFooterComponent,
    SamHeaderLinksComponent,
    SamLoginComponent,
    ListResultsMessageComponent,
    SamSearchbarComponent,
    SamFeedbackComponent,
    SamFeedbackSidenavComponent,
    OrgAddrFormComponent,
    SamSoloAccordian,
    SamStatusBannerComponent,
    SamEditorComponent,
    SamTitleSubtitleComponent,
    SamCreatePageTemplateComponent,
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
    SamListBuilderCardComponent,
    RequestDetailsComponent,
    SamLocationComponent,
    SamTableEntryComponent,
    SamPOCEntryComponent,
    SamTableSelectComponent,
    SamChipsComponent,
    SamTabDateRangeFilterComponent,
    SamSelectDateRangeFilterComponent,
  ],
  providers: [
    SamFeedbackComponent,
    FeedbackFormService,
    //RMSUserServiceImpl,
  ]
})
export class AppComponentsModule { }
