// Angular Dependencies
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { FHService } from './fh/fh.service';
import { SearchService } from './search/search.service';
import { SystemAlertsService } from './system-alerts/system-alerts.service';
import { OpportunityService } from './opportunity/opportunity.service';
import { WrapperService } from './wrapper/wrapper.service';

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
    SystemAlertsService, 
    OpportunityService,
    WrapperService,
  ]
})
export class SamAPIKitModule { }
