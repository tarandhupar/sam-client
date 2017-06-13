// Angular Dependencies
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

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
import { SearchDictionariesService } from "./search/search-dictionaries.service";
import { EntitySuggestionsServiceDirective } from "./autoCompleteWrapper/entityDunsAutoCompleteWrapper.service";
import { UserAccessMock } from "./access/access.service.mock";
import { UserSessionService } from "./user-session/user-session.service";
import { FileExtractsService } from "./file-extracts/file-extracts.service";
import { PeoplePickerService } from "./people-picker/people-picker.service";
import { PeoplePickerAutoCompleteDirective } from './autoCompleteWrapper/peoplePickerAutoCompleteWrapper.service'; 

/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
    SuggestionsServiceDirective,
    PeoplePickerAutoCompleteDirective,
    EntitySuggestionsServiceDirective
  ],
  exports: [
    SuggestionsServiceDirective,
    PeoplePickerAutoCompleteDirective,
    EntitySuggestionsServiceDirective
  ],
  imports: [
    HttpModule,
    NgIdleKeepaliveModule.forRoot(),
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
    //{ provide: UserAccessService, useValue: UserAccessMock },
    WageDeterminationService,
    LocationService,
    FeedbackService,
    DictionaryService,
    AACRequestService,
    FHWrapperService,
    SearchDictionariesService,
    UserSessionService,
    FileExtractsService,
    PeoplePickerService,
  ]
})
export class SamAPIKitModule { }
