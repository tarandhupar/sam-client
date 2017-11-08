import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './help.route';
import { HelpPage } from './help.page';
import { OverviewComponent } from './sections/overview/overview.component';
import { AboutSamComponent } from './sections/about-sam/about-sam.component';
import { NewToSamComponent } from './sections/new-to-sam/new-to-sam.component';
import { AccountsComponent } from './sections/accounts/accounts.component';
import { FeaturesComponent } from './sections/features/features.component';
import { PoliciesComponent } from './sections/policies/policies.component';
import { ReferenceLibraryComponent }  from './sections/reference-library/reference-library.component';
import { PartnersComponent } from './sections/partners/partners.component';
import { AwardDataComponent } from './sections/award-data/award-data.component';
import { AppComponentsModule } from '../app-components/app-components.module';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { TransitionToSamComponent } from './sections/transition-to-sam/transition-to-sam.component';
import { ImageLibraryComponent } from './image-library/image-library.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    SamUIKitModule,
    CommonModule,
    AppComponentsModule,
    FormsModule,
    routing,
  ],
  exports: [ ImageLibraryComponent ],
  declarations: [
    HelpPage,
    TransitionToSamComponent,
    AwardDataComponent,
    AboutSamComponent,
    AccountsComponent,
    FeaturesComponent,
    NewToSamComponent,
    OverviewComponent,
    PartnersComponent,
    PoliciesComponent,
    ReferenceLibraryComponent,
    ImageLibraryComponent
  ],
  providers: [],
})
export class HelpModule{

}
