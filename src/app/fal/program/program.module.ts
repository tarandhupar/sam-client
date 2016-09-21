import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProgramViewComponent }   from './program-view.component';
import { routing } from './program.routing';
import {KeysPipe} from '../../common/pipes/keyspipe.pipe';
import {CapitalizePipe} from '../../common/pipes/capitalize.pipe';
import {FilterMultiArrayObjectPipe} from '../../common/pipes/filter-multi-array-object.pipe';
import {AuthorizationPipe} from '../pipes/authorization.pipe';

@NgModule({
  imports: [
    BrowserModule,
    routing
  ],
  exports: [
    KeysPipe,
    CapitalizePipe,
    FilterMultiArrayObjectPipe,
    AuthorizationPipe,
    ProgramViewComponent
  ],
  declarations: [
    KeysPipe,
    CapitalizePipe,
    FilterMultiArrayObjectPipe,
    AuthorizationPipe,
    ProgramViewComponent
  ],
  providers: [],
})
export class ProgramModule { }
