import { NgModule } from "@angular/core";
import { PipesModule } from "../../app-pipes/app-pipes.module";
import { CommonModule } from "@angular/common";
import { SamUIKitModule } from "sam-ui-kit/index";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AppTemplatesModule } from "../../app-templates/index";
import { OpportunityFormRoutes } from "./opportunity-form.route";
import { OpportunityFormComponent } from "./opportunity-form.component";
import { OpportunityFormService } from "./opportunity-form.service";
import { OpportunityFormResolver } from "./opportunity-form-resolver.service";
import { OppFormNoticeTypeComponent } from "./sections/notice-type/notice-type.component";

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    SamUIKitModule,
    AppComponentsModule,
    OpportunityFormRoutes,
    ReactiveFormsModule,
    AppTemplatesModule,
  ],
  declarations: [
    OpportunityFormComponent,
    OppFormNoticeTypeComponent
  ],
  providers: [
    OpportunityFormService,
    OpportunityFormResolver
  ],
  exports: [

  ]
})
export class OpportunityFormModule { }
