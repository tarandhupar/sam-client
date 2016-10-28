import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProgramPage }   from './assistance-listing.page';
import { routing } from './assistance-listing.route';
import {KeysPipe} from '../app-pipes/keyspipe.pipe';
import {FilterMultiArrayObjectPipe} from '../app-pipes/filter-multi-array-object.pipe';
import {AuthorizationPipe} from './pipes/authorization.pipe';
import {HistoricalIndexLabelPipe} from './pipes/historical-index-label.pipe';
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
    HistoricalIndexLabelPipe
  ],
  declarations: [
    KeysPipe,
    FilterMultiArrayObjectPipe,
    AuthorizationPipe,
    ProgramPage,
    HistoricalIndexLabelPipe
  ],
  providers: [],
})
export class ProgramModule { }
