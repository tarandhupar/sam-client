import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProgramPage }   from './assistance-listing.page';
import { FinancialObligationChart } from "./assistance-listing.chart";
import { routing } from './assistance-listing.route';
import { KeysPipe } from '../app-pipes/keyspipe.pipe';
import { FilterMultiArrayObjectPipe } from '../app-pipes/filter-multi-array-object.pipe';
import { AuthorizationPipe } from './pipes/authorization.pipe';
import { HistoricalIndexLabelPipe } from './pipes/historical-index-label.pipe';
import { DateFormatPipe } from '../app-pipes/date-format.pipe';
import { SamUIKitModule } from 'ui-kit';

@NgModule({
  imports: [
    BrowserModule,
    SamUIKitModule,
    routing
  ],
  exports: [
    KeysPipe,
    FilterMultiArrayObjectPipe,
    AuthorizationPipe,
    ProgramPage,
    FinancialObligationChart,
    HistoricalIndexLabelPipe,
    DateFormatPipe
  ],
  declarations: [
    KeysPipe,
    FilterMultiArrayObjectPipe,
    AuthorizationPipe,
    ProgramPage,
    FinancialObligationChart,
    HistoricalIndexLabelPipe,
    DateFormatPipe
  ],
  providers: [],
})
export class ProgramModule { }
