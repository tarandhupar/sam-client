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

export const routes: Routes = [
  {
    path: 'help',
    component: HelpPage,
    children: [
      { path: '', redirectTo: 'overview' },
      { path: 'overview', component: OverviewComponent },
      { path: 'about', component: AboutSamComponent },
      { path: 'new', component: NewToSamComponent },
      { path: 'accounts', component: AccountsComponent },
      { path: 'features', component: FeaturesComponent },
      { path: 'policies', component: PoliciesComponent },
      { path: 'partners', component: PartnersComponent },
      { path: 'reference', component: ReferenceLibraryComponent },
      { path: 'award', component: AwardDataComponent },

    ]
  },
];

export const routing = RouterModule.forChild(routes);
