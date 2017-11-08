import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../app-pipes/app-pipes.module';
import { AppComponentsModule } from '../../app-components/app-components.module';
import { TabsOpportunityComponent } from './tabs-opportunity/tabs-opportunity.component';
import { OpportunityAuthGuard } from './authgaurd/authguard.service';

@NgModule({
  imports: [
    CommonModule,
    SamUIKitModule,
    ReactiveFormsModule,
    AppComponentsModule,
    PipesModule
  ],
  declarations: [
    TabsOpportunityComponent
  ],
  exports: [
    TabsOpportunityComponent
  ],
  providers: [
    OpportunityAuthGuard
  ],
})
export class OppComponentsModule {}
