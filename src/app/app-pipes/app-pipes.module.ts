import { NgModule } from '@angular/core';

import { CapitalizePipe } from './capitalize.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { FilterMultiArrayObjectPipe } from './filter-multi-array-object.pipe';
import { GroupByPipe } from './group-by.pipe';
import { KeysPipe } from './keyspipe.pipe';
import { OrganizationTypeCodePipe } from './organization-type-code.pipe';
import { SortArrayOfObjects } from "./sort-array-object.pipe";
import { FHTitleCasePipe } from "./fhTitleCase.pipe";
import { ShortDatePipe } from "./short-date.pipe";
import { FeedsDateTimePipe } from "./feeds-date-time-display.pipe";

@NgModule({
  imports: [],
  exports: [
    CapitalizePipe,
    DateFormatPipe,
    FeedsDateTimePipe,
    FilterMultiArrayObjectPipe,
    GroupByPipe,
    KeysPipe,
    OrganizationTypeCodePipe,
    SortArrayOfObjects,
    FHTitleCasePipe,
    ShortDatePipe,
  ],
  declarations: [
    CapitalizePipe,
    DateFormatPipe,
    FeedsDateTimePipe,
    FilterMultiArrayObjectPipe,
    GroupByPipe,
    KeysPipe,
    OrganizationTypeCodePipe,
    SortArrayOfObjects,
    FHTitleCasePipe,
    ShortDatePipe,
  ],
  providers: [],
})
export class PipesModule { }
