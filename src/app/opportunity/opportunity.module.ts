import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SamUIKitModule } from 'sam-ui-kit/index';
import { AppComponentsModule } from '../app-components/app-components.module';
import { PipesModule } from '../app-pipes/app-pipes.module';
import { OppComponentsModule } from './components/index';
import { OpportunityFormModule } from './opportunity-operations/opportunity-form.module';
import { OpportunityReviewComponent } from "./opportunity-operations/workflow/review/opportunity-review.component";
import { OpportunityResult } from "./opportunity-workspace/opportunity-result/opportunity-result.component";
import { OPPWorkspacePage } from "./opportunity-workspace/opportunity-workspace.page";
import { OpportunityPage } from './opportunity.page';
import { routing } from './opportunity.route';
import { FilesizePipe } from './pipes/filesize.pipe';
import { FixHTMLPipe } from './pipes/fix-html.pipe';
import { OpportunityTypeLabelPipe } from './pipes/opportunity-type-label.pipe';
import { TimezoneLabelPipe } from './pipes/timezone-label.pipe';

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
