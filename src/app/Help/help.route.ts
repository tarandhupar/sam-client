import { Routes, RouterModule } from '@angular/router';
import { HelpPage } from './help.page';
import { OverviewComponent } from './sections/overview/overview.component';
import { AboutSamComponent } from './sections/about-sam/about-sam.component';
import { NewToSamComponent } from "./sections/new-to-sam/new-to-sam.component";
import { AccountsComponent } from "./sections/accounts/accounts.component";
import { FeaturesComponent } from "./sections/features/features.component";
import { PoliciesComponent } from "./sections/policies/policies.component";
import { ReferenceLibraryComponent}  from "./sections/reference-library/reference-library.component";
import { PartnersComponent } from "./sections/partners/partners.component";
import { AwardDataComponent } from "./sections/award-data/award-data.component";
import { TransitionToSamComponent } from "./sections/transition-to-sam/transition-to-sam.component";
import { SamFeedbackComponent } from '../app-components/feedback-form/feedback-form.component';

export const routes: Routes = [
  {
    path: 'help',
    component: HelpPage,
    canDeactivate:[SamFeedbackComponent],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      { path: 'overview', component: OverviewComponent, canDeactivate:[SamFeedbackComponent] },
      { path: 'transition', component: TransitionToSamComponent, canDeactivate:[SamFeedbackComponent] },
      { path: 'about', component: AboutSamComponent, canDeactivate:[SamFeedbackComponent] },
      { path: 'new', component: NewToSamComponent, canDeactivate:[SamFeedbackComponent] },
      { path: 'accounts', component: AccountsComponent, canDeactivate:[SamFeedbackComponent] },
      { path: 'features', component: FeaturesComponent, canDeactivate:[SamFeedbackComponent] },
      { path: 'policies', component: PoliciesComponent, canDeactivate:[SamFeedbackComponent] },
      { path: 'partners', component: PartnersComponent, canDeactivate:[SamFeedbackComponent] },
      { path: 'reference', component: ReferenceLibraryComponent, canDeactivate:[SamFeedbackComponent] },
      { path: 'award', component: AwardDataComponent, canDeactivate:[SamFeedbackComponent] },
    ]
  },
];

export const routing = RouterModule.forChild(routes);
