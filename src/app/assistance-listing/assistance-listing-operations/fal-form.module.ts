import {NgModule} from "@angular/core";
import {PipesModule} from "../../app-pipes/app-pipes.module";
import {BrowserModule} from "@angular/platform-browser";
import {SamUIKitModule} from "sam-ui-kit/index";
import {AppComponentsModule} from "../../app-components/app-components.module";
import {FALFormRoutes} from "./fal-form.route";
import {ReactiveFormsModule} from "@angular/forms";
import {FALFormComponent} from "./fal-form.component";
import {SideNavComponent} from "./navigation/side-nav.component";
import {FALFormActionComponent} from "./navigation/fal-form-action.component";
import {FALFormResolver} from "./fal-form-resolver.service";
import {FALFormService} from "./fal-form.service";
import {ProgramService} from "../../../api-kit/program/program.service";
import {FALFormHeaderInfoComponent} from "./sections/header-information/fal-form-header-info.component";
import {FALFormOverviewComponent} from "./sections/overview/fal-form-overview.component";
import {FALFormContactInfoComponent} from "./sections/contact-information/fal-form-contact.component";
import {FALFormContactEditComponent} from "./sections/contact-information/fal-form-contact-edit.component";

@NgModule({
  imports: [
    PipesModule,
    BrowserModule,
    SamUIKitModule,
    AppComponentsModule,
    FALFormRoutes,
    ReactiveFormsModule
  ],
  declarations: [
    FALFormComponent,
    SideNavComponent,
    FALFormActionComponent,
    FALFormHeaderInfoComponent,
    FALFormOverviewComponent,
    FALFormContactInfoComponent,
    FALFormContactEditComponent
  ],
  providers: [
    FALFormResolver,
    FALFormService,
    ProgramService
  ],
})
export class FALFormModule { }
