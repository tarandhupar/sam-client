import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit/index';
import { AppComponentsModule } from '../../app-components/app-components.module';
import { PipesModule } from '../../app-pipes/app-pipes.module';
import { OppComponentsModule } from '../components/index';
import { OpportunityFormComponent } from './framework/form-component/opportunity-form.component';
import { OpportunityFormService } from './framework/service/opportunity-form/opportunity-form.service';
import { OpportunitySideNavService } from './framework/service/sidenav/opportunity-form-sidenav.service';
import { OppNoticeTypeFieldService } from './framework/service/notice-type-field-map/notice-type-field-map.service';
import { OpportunityFormResolver } from './opportunity-form-resolver.service';
import { OpportunityFormRoutes } from './opportunity-form.route';
import { OpportunityHeaderInfoComponent } from './sections/header-information/opp-form-header-info.component';
import { OpportunityGeneralInfoComponent } from './sections/general-information/general-information.component';
import { OpportunityDescriptionComponent } from "./sections/description/description.component";
import { OpportunityContactInfoComponent } from './sections/contact-information/opp-form-contact-info.component';
import { OpportunityClassificationComponent } from "./sections/classification/opp-form-classification.component";

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    SamUIKitModule,
    AppComponentsModule,
    OpportunityFormRoutes,
    ReactiveFormsModule,
    OppComponentsModule
  ],
  declarations: [
    OpportunityFormComponent,
    OpportunityHeaderInfoComponent,
    OpportunityGeneralInfoComponent,
    OpportunityDescriptionComponent,
    OpportunityClassificationComponent,
    OpportunityContactInfoComponent,
  ],
  providers: [
    OpportunityFormService,
    OpportunityFormResolver,
    OpportunitySideNavService,
    OppNoticeTypeFieldService
  ],
  exports: [

  ]
})
export class OpportunityFormModule { }
