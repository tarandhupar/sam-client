import { KeysPipe } from "./keyspipe.pipe";
import { DateFormatPipe } from "./date-format.pipe";
import { FilterMultiArrayObjectPipe } from "./filter-multi-array-object.pipe";
import { NgModule } from "@angular/core";
import { CapitalizePipe } from "./capitalize.pipe";

@NgModule({
  imports: [],
  exports: [
    FilterMultiArrayObjectPipe,
    DateFormatPipe,
    KeysPipe,
    CapitalizePipe
  ],
  declarations: [
    KeysPipe,
    FilterMultiArrayObjectPipe,
    DateFormatPipe,
    CapitalizePipe
  ],
  providers: [],
})
export class PipesModule { }
