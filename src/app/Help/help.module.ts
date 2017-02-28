import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
import { SamUIKitModule } from 'samUIKit';
import { TransitionToSamComponent } from './sections/transition-to-sam/transition-to-sam.component';
import { ImageLibraryComponent } from './image-library/image-library.component';

@NgModule({
  imports: [
    SamUIKitModule,
    BrowserModule,
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
