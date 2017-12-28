import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import {
  RelatedNoticeAutocompleteService,
  RelatedNoticeServiceDirective
} from '../../../api-kit/autoCompleteWrapper/related-notice/related-notice-autocomplete.service';
import { AppComponentsModule } from '../../app-components/app-components.module';
import { PipesModule } from '../../app-pipes/app-pipes.module';
import { OpportunityAuthGuard } from './authgaurd/authguard.service';
import {
  OpportunityErrorDisplayComponent,
  OpportunityErrorDisplayHelperComponent
} from "./opportunity-error-display/opportunity-error-display.component";
import { RelatedNoticeComponent } from './related-notice/related-notice.component';
import { TabsOpportunityComponent } from './tabs-opportunity/tabs-opportunity.component';
import { OpportunityTypeLabelPipe } from '../pipes/opportunity-type-label.pipe';

@NgModule({
  imports: [
    CommonModule,
    SamUIKitModule,
    ReactiveFormsModule,
    AppComponentsModule,
    PipesModule
  ],
  declarations: [
    TabsOpportunityComponent,
    OpportunityErrorDisplayComponent,
    OpportunityErrorDisplayHelperComponent,
    RelatedNoticeComponent,
    RelatedNoticeServiceDirective
  ],
  exports: [
    TabsOpportunityComponent,
    OpportunityErrorDisplayComponent,
    RelatedNoticeComponent,
    RelatedNoticeServiceDirective,
  ],
  providers: [
    OpportunityAuthGuard,
    RelatedNoticeAutocompleteService,
  ],
})
export class OppComponentsModule {}
