import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProgramPage }   from './assistance-listing.page';
import { routing } from './assistance-listing.routing';
import {KeysPipe} from '../app-pipes/keyspipe.pipe';
import {CapitalizePipe} from '../app-pipes/capitalize.pipe';
import {FilterMultiArrayObjectPipe} from '../app-pipes/filter-multi-array-object.pipe';
import {AuthorizationPipe} from './pipes/authorization.pipe';
import {HistoricalIndexLabelPipe} from './pipes/historical-index-label.pipe';
import {SamAngularModule} from '../common/samuikit/samuikit.module';
import { SamUIKitModule } from 'ui-kit';

@NgModule({
  imports: [
    BrowserModule,
    SamUIKitModule,
    SamAngularModule,
    routing
  ],
  exports: [
    KeysPipe,
    CapitalizePipe,
    FilterMultiArrayObjectPipe,
    AuthorizationPipe,
    ProgramPage,
    HistoricalIndexLabelPipe
  ],
  declarations: [
    KeysPipe,
    CapitalizePipe,
    FilterMultiArrayObjectPipe,
    AuthorizationPipe,
    ProgramPage,
    HistoricalIndexLabelPipe
  ],
  providers: [],
})
export class ProgramModule { }
