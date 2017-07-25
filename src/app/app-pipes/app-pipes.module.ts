import { NgModule } from '@angular/core';

import { CapitalizePipe } from './capitalize.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { DateTimeDisplayPipe } from './date-time-display.pipe';
import { FilterMultiArrayObjectPipe } from './filter-multi-array-object.pipe';
import { GroupByPipe } from './group-by.pipe';
import { KeysPipe } from './keyspipe.pipe';
import { OrganizationTypeCodePipe } from './organization-type-code.pipe';
import { SortArrayOfObjects } from "./sort-array-object.pipe";

@NgModule({
  imports: [],
  exports: [
    CapitalizePipe,
    DateFormatPipe,
    DateTimeDisplayPipe,
    FilterMultiArrayObjectPipe,
    GroupByPipe,
    KeysPipe,
    OrganizationTypeCodePipe,
    SortArrayOfObjects
  ],
  declarations: [
    CapitalizePipe,
    DateFormatPipe,
    DateTimeDisplayPipe,
    FilterMultiArrayObjectPipe,
    GroupByPipe,
    KeysPipe,
    OrganizationTypeCodePipe,
    SortArrayOfObjects
  ],
  providers: [],
})
export class PipesModule { }
