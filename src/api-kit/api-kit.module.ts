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
import { AACRequestService } from "./aac-request/aac-request.service";
import { FHWrapperService } from "./fh/fhWrapper.service";
import { EntitySuggestionsServiceDirective } from "./autoCompleteWrapper/entityDunsAutoCompleteWrapper.service";
import { UserSessionService } from "./user-session/user-session.service";
import { FileExtractsService } from "./file-extracts/file-extracts.service";
import { PeoplePickerService } from "./people-picker/people-picker.service";
import { PeoplePickerAutoCompleteDirective } from './autoCompleteWrapper/peoplePickerAutoCompleteWrapper.service';
import { AgencyPickerAutoCompleteDirective } from "./autoCompleteWrapper/agencyPickerAutoCompleteWrapper.service";
import { WatchlistService } from './watchlist/watchlist.service';
import { MsgFeedService } from "./msg-feed/msg-feed.service";
import { MsgFeedServiceMock } from "./msg-feed/msg-feed.mock";

/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
    SuggestionsServiceDirective,
    PeoplePickerAutoCompleteDirective,
    EntitySuggestionsServiceDirective,
    AgencyPickerAutoCompleteDirective
  ],
  exports: [
    SuggestionsServiceDirective,
    PeoplePickerAutoCompleteDirective,
    EntitySuggestionsServiceDirective,
    AgencyPickerAutoCompleteDirective
  ],
  imports: [
    HttpModule,
    NgIdleKeepaliveModule.forRoot(),
  ],
  providers: [
    SearchService,
    //{ provide: SearchService, useClass: SearchServiceMock },
    FHService,
    //{ provide: FHService, useClass: FHServiceMock},
    IAMService,
    SystemAlertsService,
    WatchlistService,
    //{ provide: SystemAlertsService, useClass: SystemAlertsServiceMock },
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
    //{ provide: FeedbackService, useClass: FeedbackServiceMock },
    AACRequestService,
    FHWrapperService,
    UserSessionService,
    FileExtractsService,
    PeoplePickerService,
    //{ provide: PeoplePickerService, useClass: PeoplePickerServiceMock }
    MsgFeedService,
    // { provide: MsgFeedService, useClass: MsgFeedServiceMock }

  ]
})
export class SamAPIKitModule { }
