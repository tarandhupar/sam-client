import { KeysPipe } from './keyspipe.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { FilterMultiArrayObjectPipe } from './filter-multi-array-object.pipe';
import { NgModule } from '@angular/core';
import { CapitalizePipe } from './capitalize.pipe';
import { OrganizationTypeCodePipe } from './organization-type-code.pipe';
import {SortArrayOfObjects} from "./sort-array-object.pipe";

@NgModule({
  imports: [],
  exports: [
    FilterMultiArrayObjectPipe,
    DateFormatPipe,
    KeysPipe,
    CapitalizePipe,
    OrganizationTypeCodePipe,
    SortArrayOfObjects
  ],
  declarations: [
    KeysPipe,
    FilterMultiArrayObjectPipe,
    DateFormatPipe,
    CapitalizePipe,
    OrganizationTypeCodePipe,
    SortArrayOfObjects
  ],
  providers: [],
})
export class PipesModule { }
