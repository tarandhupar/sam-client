// Angular Dependencies
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { FHService } from './fh/fh.service';
import { IAMService } from './iam/iam.service';
import { EntityService } from './entity/entity.service';
import { ExclusionService } from './exclusion/exclusion.service';
import { SearchService } from './search/search.service';
import { SystemAlertsService } from './system-alerts/system-alerts.service';
import { OpportunityService } from './opportunity/opportunity.service';
import { WageDeterminationService } from './wage-determination/wage-determination.service';
import { WrapperService } from './wrapper/wrapper.service';
import { SuggestionsService } from './search/suggestions.service';
import { AutoCompleteWrapper,SuggestionsServiceDirective } from './autoCompleteWrapper/autoCompleteWrapper.service';
import { UserDirService } from './user-directory/user-directory.service';
import { UserAccessService } from "./access/access.service";
import { LocationService } from "./location/location.service";
import { FeedbackService } from "./feedback/feedback.service";
import { DictionaryService } from "./dictionary/dictionary.service";
import { AACRequestService } from "./aac-request/aac-request.service";
import { FHWrapperService } from "./fh/fhWrapper.service";

/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
    SuggestionsServiceDirective
  ],
  exports: [
    SuggestionsServiceDirective
  ],
  imports: [
    HttpModule,
  ],
  providers: [
    SearchService,
    FHService,
    IAMService,
    SystemAlertsService,
    EntityService,
    ExclusionService,
    OpportunityService,
    WrapperService,
    SuggestionsService,
    AutoCompleteWrapper,
    UserDirService,
    UserAccessService,
    WageDeterminationService,
    LocationService,
    FeedbackService,
    DictionaryService,
    AACRequestService,
    FHWrapperService,
  ]
})
export class SamAPIKitModule { }
