import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SamUIKitModule } from 'sam-ui-kit/index';
import { AppComponentsModule } from '../../app-components/app-components.module';
import { PipesModule } from '../../app-pipes/app-pipes.module';
import { OppComponentsModule } from '../components/index'
import { OpportunityFormComponent } from './framework/form-component/opportunity-form.component';
import { OpportunityFormService } from './framework/service/opportunity-form.service';
import { OpportunityFormResolver } from './opportunity-form-resolver.service';
import { OpportunityFormRoutes } from './opportunity-form.route';
import { OpportunityDescriptionComponent } from "./sections/description/description.component";
import { OpportunityHeaderInformationComponent } from './sections/header-information/header-information.component';
import { OpportunityHeaderInfoComponent } from './sections/header-information/opp-form-header-info.component';

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
    OpportunityDescriptionComponent
  ],
  providers: [
    OpportunityFormService,
    OpportunityFormResolver
  ],
  exports: [

  ]
})
export class OpportunityFormModule { }
