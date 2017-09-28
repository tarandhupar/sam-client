import { NgModule } from "@angular/core";
import { PipesModule } from "../../app-pipes/app-pipes.module";
import { CommonModule } from "@angular/common";
import { SamUIKitModule } from "sam-ui-kit/index";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { FALFormRoutes } from "./fal-form.route";
import { ReactiveFormsModule } from "@angular/forms";
import { FALComponentsModule } from "../components/index";
import { ProgramService } from "../../../api-kit/program/program.service";
import { FALFormHeaderInfoComponent } from "./sections/header-information/fal-form-header-info.component";
import { FALFormOverviewComponent } from "./sections/overview/fal-form-overview.component";
import { FALFormContactInfoComponent } from "./sections/contact-information/fal-form-contact.component";
import { FALFormFinancialInfoOtherComponent } from "./sections/financial-info/other/fal-form-financial-info-other.component";
import { FALFormCriteriaInfoComponent } from "./sections/criteria-information/fal-form-criteria-info.component";
import { FALFormObligationsInfoComponent } from "./sections/financial-info/obligations/fal-form-obligation-info.component";
import { FALFormComplianceRequirementsComponent } from "./sections/compliance-requirements/fal-form-compliance-requirements.component";
import { FALFormComponent } from "./fal-form.component";
import { SideNavComponent } from "./navigation/side-nav.component";
import { FALFormResolver } from "./fal-form-resolver.service";
import { FALFormService } from "./fal-form.service";
import { FALAuthorizationsComponent } from "./sections/authorizations/fal-form-authorizations.component";
import { FALAssistanceComponent } from "./sections/applying-for-assistance/fal-form-applying-assistance.component";
// import { AppTemplatesModule } from "../../app-templates/index";
import {
  FAlProgramServiceDirective,
  FALProgramAutoCompleteWrapper
} from "../../../api-kit/autoCompleteWrapper/falAutoCompleteWrapper.service";
//import {FALContactInfoTableComponent} from "../components/contact-information-table/contact-information-table.component";

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    SamUIKitModule,
    AppComponentsModule,
    FALFormRoutes,
    ReactiveFormsModule,
    // AppTemplatesModule,
    FALComponentsModule
  ],
  declarations: [
    FALFormComponent,
    SideNavComponent,
    FALFormHeaderInfoComponent,
    FALFormOverviewComponent,
    FALFormObligationsInfoComponent,
    FALFormContactInfoComponent,
    //FALContactInfoTableComponent,
    FALAssistanceComponent,
    FALFormFinancialInfoOtherComponent,
    FALFormCriteriaInfoComponent,
    FALFormComplianceRequirementsComponent,
    FAlProgramServiceDirective,
    FALAuthorizationsComponent
  ],
  providers: [
    FALFormResolver,
    FALFormService,
    ProgramService,
    FALProgramAutoCompleteWrapper
  ],
  exports: [
    //FALContactInfoTableComponent
  ]
})
export class FALFormModule { }
