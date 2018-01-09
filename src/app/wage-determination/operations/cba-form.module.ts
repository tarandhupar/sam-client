import {NgModule} from "@angular/core";
import {PipesModule} from "../../app-pipes/app-pipes.module";
import {CommonModule} from "@angular/common";
import {SamUIKitModule} from "../../../sam-ui-elements/src/ui-kit";
import {AppComponentsModule} from "../../app-components";
import {ReactiveFormsModule} from "@angular/forms";
import {CBAFormRoutes} from "./cba-form.route";
import {CBAComponentsModule} from "../components";
import {CBAFormComponent} from "./framework/form-component/cba-form.component";
import {CBAContractorInfoComponent} from "./sections/contractor/contractor-info.component";
import {CBALocationComponent} from "./sections/location/location.component";
import {CBAContractInfoComponent} from "./sections/contract/contract-info.component";
import {CBADatesComponent} from "./sections/dates/dates.component";
import {CBASideNavService} from "./framework/service/sidenav/cba-form-sidenav.service";
import {CBAFormResolver} from "./cba-form-resolver.service";

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    SamUIKitModule,
    AppComponentsModule,
    ReactiveFormsModule,
    CBAFormRoutes,
    CBAComponentsModule
  ],
  declarations: [
    CBAFormComponent,
    CBAContractorInfoComponent,
    CBALocationComponent,
    CBAContractInfoComponent,
    CBADatesComponent
  ],
  providers: [
    CBASideNavService,
    CBAFormResolver
  ],
  exports: []
})
export class CBAFormModule {
}
