import { NgModule } from '@angular/core';
import { PipesModule } from '../../app-pipes/app-pipes.module';
import { CommonModule } from '@angular/common';
import { SamUIKitModule } from 'sam-ui-kit/index';
import { AppComponentsModule } from '../../app-components/app-components.module';
import { ReactiveFormsModule } from '@angular/forms';
// import { AppTemplatesModule } from '../../app-templates/index';
import { OpportunityFormRoutes } from './opportunity-form.route';
import { OpportunityFormComponent } from './framework/form-component/opportunity-form.component';
import { OpportunityFormService } from './framework/service/opportunity-form.service';
import { OpportunityFormResolver } from './opportunity-form-resolver.service';
import { OpportunityHeaderInformationComponent } from './sections/header-information/header-information.component';
import { OppComponentsModule } from '../components/index'

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    SamUIKitModule,
    AppComponentsModule,
    OpportunityFormRoutes,
    ReactiveFormsModule,
    // AppTemplatesModule,
    OppComponentsModule
  ],
  declarations: [
    OpportunityFormComponent,
    OpportunityHeaderInformationComponent
  ],
  providers: [
    OpportunityFormService,
    OpportunityFormResolver
  ],
  exports: [

  ]
})
export class OpportunityFormModule { }
