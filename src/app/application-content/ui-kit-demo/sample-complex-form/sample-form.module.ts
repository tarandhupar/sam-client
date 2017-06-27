import { NgModule } from "@angular/core";
import { PipesModule } from "app/app-pipes/app-pipes.module";
import { BrowserModule } from "@angular/platform-browser";
import { SamUIKitModule } from "sam-ui-kit/index";
import { AppComponentsModule } from "app/app-components/app-components.module";
import { SampleFormRoutes } from "./sample-form.route";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { SampleFormPage1Component } from "./sections/page1/page1.component";
import { SampleFormPage2Component } from "./sections/page2/page2.component";
import { SampleFormPage3Component } from "./sections/page3/page3.component";
import { SampleFormComponent } from "./sample-form.component";
import { SampleFormResolver } from "./sample-form-resolver.service";
import { SampleFormService } from "./sample-form.service";

@NgModule({
  imports: [
    PipesModule,
    BrowserModule,
    SamUIKitModule,
    AppComponentsModule,
    SampleFormRoutes,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    SampleFormComponent,
    SampleFormPage1Component,
    SampleFormPage2Component,
    SampleFormPage3Component,
  ],
  providers: [
    SampleFormResolver,
    SampleFormService
  ]
})
export class SampleFormModule { }
