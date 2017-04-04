import { Routes, RouterModule } from '@angular/router';
import { ProgramPage } from './assistance-listing.page';
import { ProgramDisplayPageDemoPage } from './display-template-demo/display-template-demo.page';
import { ProgramPageOperations } from './assistance-listing-operations/assistance-listing-operations.page';
import { FalWorkspacePage } from './assistance-listing-workspace/assistance-listing-workspace.page';
import { AccessRestrictedPage } from './assistance-listing-workspace/program-result/testauthenvironment.page';
import { FALHeaderInfoComponent } from './assistance-listing-operations/sections/header-information/header-information.component';
import { FALOverviewComponent } from './assistance-listing-operations/sections/overview/overview.component';
import { FALContactInfoComponent } from './assistance-listing-operations/sections/contact-information/contact-information.component';
import { FinancialObligationsComponent } from "./assistance-listing-operations/sections/financial-info/obligations/obligation.component";
import { FinancialInfoFormPage2 } from "./assistance-listing-operations/sections/financial-info/other/financial-info-other.page";
import {FALCriteriaInfoComponent} from "./assistance-listing-operations/sections/criteria-information/criteria-information.component";

export const routes: Routes = [
  {path: 'programs/:id/view', component: ProgramPage},
  {path: 'programs', component: ProgramPage},
  {path: 'accessrestricted', component: AccessRestrictedPage},
];

if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({path: 'programs/demo', component: ProgramDisplayPageDemoPage});
}

if (SHOW_HIDE_RESTRICTED_PAGES === 'true' || ENV === 'development') {
  routes.unshift(
    {path: 'falworkspace', component: FalWorkspacePage},
    {
      path: 'programs/add', component: ProgramPageOperations,
      children: [
        {path: '', pathMatch: 'full', redirectTo: 'header-information'},
        {path: 'header-information', component: FALHeaderInfoComponent},
        {path: 'overview', component: FALOverviewComponent},
        {path: 'financial-information', pathMatch: 'full', redirectTo: 'financial-information/obligations'},
        {path: 'financial-information/obligations', component: FinancialObligationsComponent},
        {path: 'financial-information/other-financial-info', component: FinancialInfoFormPage2},
        {path: 'criteria-information', component: FALCriteriaInfoComponent},
        {path: 'contact-information', component: FALContactInfoComponent},
      ]
    },
    {
      path: 'programs/:id/edit', component: ProgramPageOperations,
      children: [
        {path: '', pathMatch: 'full', redirectTo: 'header-information'},
        {path: 'header-information', component: FALHeaderInfoComponent},
        {path: 'overview', component: FALOverviewComponent},
        {path: 'financial-information', pathMatch: 'full', redirectTo: 'financial-information/obligations'},
        {path: 'financial-information/obligations', component: FinancialObligationsComponent},
        {path: 'financial-information/other-financial-info', component: FinancialInfoFormPage2},
        {path: 'criteria-information', component: FALCriteriaInfoComponent},
        {path: 'contact-information', component: FALContactInfoComponent},
      ]
    },
  );
}
export const routing = RouterModule.forChild(routes);
