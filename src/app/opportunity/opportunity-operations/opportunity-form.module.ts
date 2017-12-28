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
import { OppNoticeTypeMapService } from './framework/service/notice-type-map/notice-type-map.service';
import { OpportunityFormResolver } from './opportunity-form-resolver.service';
import { OpportunityFormRoutes } from './opportunity-form.route';
import { OpportunityHeaderInfoComponent } from './sections/header-information/opp-form-header-info.component';
import { OpportunityAwardDetailsComponent } from './sections/award-details/opp-form-award-details.component';
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
    OpportunityAwardDetailsComponent,
    OpportunityGeneralInfoComponent,
    OpportunityDescriptionComponent,
    OpportunityClassificationComponent,
    OpportunityContactInfoComponent,
  ],
  providers: [
    OpportunityFormService,
    OpportunityFormResolver,
    OpportunitySideNavService,
    OppNoticeTypeMapService
  ],
  exports: [

  ]
})
export class OpportunityFormModule { }
