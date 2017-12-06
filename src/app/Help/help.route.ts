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
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';

export const routes: Routes = [
  {
    path: '',
    component: HelpPage,
    canDeactivate:[FeedbackFormService],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      { path: 'overview', component: OverviewComponent, canDeactivate:[FeedbackFormService] },
      { path: 'transition', component: TransitionToSamComponent, canDeactivate:[FeedbackFormService] },
      { path: 'about', component: AboutSamComponent, canDeactivate:[FeedbackFormService] },
      { path: 'new', component: NewToSamComponent, canDeactivate:[FeedbackFormService] },
      { path: 'accounts', component: AccountsComponent, canDeactivate:[FeedbackFormService] },
      { path: 'features', component: FeaturesComponent, canDeactivate:[FeedbackFormService] },
      { path: 'policies', component: PoliciesComponent, canDeactivate:[FeedbackFormService] },
      { path: 'partners', component: PartnersComponent, canDeactivate:[FeedbackFormService] },
      { path: 'reference', component: ReferenceLibraryComponent, canDeactivate:[FeedbackFormService] },
      { path: 'award', component: AwardDataComponent, canDeactivate:[FeedbackFormService] },
    ]
  },
];

export const routing = RouterModule.forChild(routes);
