import { KeysPipe } from "./keyspipe.pipe";
import { DateFormatPipe } from "./date-format.pipe";
import { FilterMultiArrayObjectPipe } from "./filter-multi-array-object.pipe";
import { NgModule } from "@angular/core";

@NgModule({
  imports: [],
  exports: [
    FilterMultiArrayObjectPipe,
    DateFormatPipe,
    KeysPipe
  ],
  declarations: [
    KeysPipe,
    FilterMultiArrayObjectPipe,
    DateFormatPipe
  ],
  providers: [],
})
export class PipesModule { }
