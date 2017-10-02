import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpportunityPage }   from './opportunity.page';
import { routing } from './opportunity.route';
import { PipesModule } from '../app-pipes/app-pipes.module';
import { OpportunityTypeLabelPipe } from './pipes/opportunity-type-label.pipe';
import { TimezoneLabelPipe } from './pipes/timezone-label.pipe';
import { FixHTMLPipe } from './pipes/fix-html.pipe';
import { FilesizePipe } from './pipes/filesize.pipe';
import { SamUIKitModule } from 'sam-ui-kit';
import { AppComponentsModule } from '../app-components/app-components.module';
import { OpportunityFormModule } from './opportunity-operations/opportunity-form.module';
import { FormsModule } from '@angular/forms';
import { OppComponentsModule } from './components/index';
import {OPPWorkspacePage} from "./opportunity-workspace/opportunity-workspace.page";
import {OpportunityResult} from "./opportunity-workspace/opportunity-result/opportunity-result.component";
import {OpportunityReviewComponent} from "./opportunity-operations/workflow/review/opportunity-review.component";

@NgModule({
  imports: [
    FormsModule,
    PipesModule,
    CommonModule,
    routing,
    SamUIKitModule,
    AppComponentsModule,
    OpportunityFormModule,
    OppComponentsModule,
    OpportunityFormModule
  ],
  exports: [
    OpportunityPage,
    OpportunityTypeLabelPipe,
    TimezoneLabelPipe,
    FixHTMLPipe,
    FilesizePipe,
    OpportunityResult
  ],
  declarations: [
    OpportunityPage,
    OpportunityTypeLabelPipe,
    TimezoneLabelPipe,
    FixHTMLPipe,
    FilesizePipe,
    OPPWorkspacePage,
    OpportunityResult,
    OpportunityReviewComponent
  ],
})
export class OpportunityModule { }
