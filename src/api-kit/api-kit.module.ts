// Angular Dependencies
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { FHService } from './fh/fh.service';
import { IAMService } from './iam/iam.service';
import { SearchService } from './search/search.service';
import { SystemAlertsService } from './system-alerts/system-alerts.service';
import { OpportunityService } from './opportunity/opportunity.service';
import { WrapperService } from './wrapper/wrapper.service';
import { SuggestionsService } from './search/suggestions.service';
import { AutoCompleteWrapper } from './autoCompleteWrapper/autoCompleteWrapper.service';

/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
  ],
  imports: [
    HttpModule,
  ],
  providers: [
    SearchService,
    FHService,
    IAMService,
    SystemAlertsService,
    OpportunityService,
    WrapperService,
    SuggestionsService,
    AutoCompleteWrapper
  ]
})
export class SamAPIKitModule { }
