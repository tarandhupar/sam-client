import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OpportunityPage }   from './opportunity.page';
import { routing } from './opportunity.route';
import { PipesModule } from '../app-pipes/app-pipes.module';
import { OpportunityTypeLabelPipe } from './pipes/opportunity-type-label.pipe';
import { TimezoneLabelPipe } from './pipes/timezone-label.pipe';
import { FixHTMLPipe } from './pipes/fix-html.pipe';
import { FilesizePipe } from './pipes/filesize.pipe';
import { SamUIKitModule } from 'sam-ui-kit';
import { AppComponentsModule } from '../app-components/app-components.module';


@NgModule({
  imports: [
    PipesModule,
    BrowserModule,
    routing,
    SamUIKitModule,
    AppComponentsModule
  ],
  exports: [
    OpportunityPage,
    OpportunityTypeLabelPipe,
    TimezoneLabelPipe,
    FixHTMLPipe,
    FilesizePipe
  ],
  declarations: [
    OpportunityPage,
    OpportunityTypeLabelPipe,
    TimezoneLabelPipe,
    FixHTMLPipe,
    FilesizePipe
  ],
})
export class OpportunityModule { }
