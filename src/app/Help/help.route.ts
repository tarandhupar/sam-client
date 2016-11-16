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
    path: '',
    component: HelpPage,
    children: [
      { path: 'help/overview', component: OverviewComponent },
      { path: 'help/about', component: AboutSamComponent },
      { path: 'help/new', component: NewToSamComponent },
      { path: 'help/accounts', component: AccountsComponent },
      { path: 'help/features', component: FeaturesComponent },
      { path: 'help/policies', component: PoliciesComponent },
      { path: 'help/partners', component: PartnersComponent },
      { path: 'help/reference', component: ReferenceLibraryComponent },
      { path: 'help/award', component: AwardDataComponent },

    ]
  },
];

export const routing = RouterModule.forChild(routes);
