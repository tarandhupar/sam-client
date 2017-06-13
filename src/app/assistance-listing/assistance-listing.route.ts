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
import { FinancialInfoPage2 } from "./assistance-listing-operations/sections/financial-info/other/financial-info-other.page";
import { ComplianceRequirementsPage } from "./assistance-listing-operations/sections/compliance-requirements/compliance-requirements.page";
import { FALCriteriaInfoComponent } from "./assistance-listing-operations/sections/criteria-information/criteria-information.component";
import { FALAuthorizationsComponent } from "./assistance-listing-operations/sections/authorizations/authorizations.component";
import { FALAssistanceComponent } from "./assistance-listing-operations/sections/applying-for-assistance/applying-for-assistance.component";
import {RejectFALComponent} from "./assistance-listing-operations/workflow/reject/reject-fal.component";
import { FALFormArchiveRequestComponent } from "./assistance-listing-change-request/fal-form-archive-request.component";


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
    {path: 'fal/workspace', component: FalWorkspacePage},
    {path: 'programs/:id/reject', component: RejectFALComponent},
    {
      path: 'programs/add', component: ProgramPageOperations,
      children: [
        {path: '', pathMatch: 'full', redirectTo: 'header-information'},
        {path: 'header-information', component: FALHeaderInfoComponent},
        {path: 'overview', component: FALOverviewComponent},
        {path: 'financial-information', pathMatch: 'full', redirectTo: 'financial-information/obligations'},
        {path: 'financial-information/obligations', component: FinancialObligationsComponent},
        {path: 'financial-information/other-financial-info', component: FinancialInfoPage2},
        {path: 'compliance-requirements', component: ComplianceRequirementsPage},
        {path: 'criteria-information', component: FALCriteriaInfoComponent},
        {path: 'contact-information', component: FALContactInfoComponent},
        {path: 'authorization', component: FALAuthorizationsComponent },
        {path: 'applying-for-assistance', component: FALAssistanceComponent }
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
        {path: 'financial-information/other-financial-info', component: FinancialInfoPage2},
        {path: 'compliance-requirements', component: ComplianceRequirementsPage},
        {path: 'criteria-information', component: FALCriteriaInfoComponent},
        {path: 'contact-information', component: FALContactInfoComponent},
        {path: 'authorization', component: FALAuthorizationsComponent },
        {path: 'applying-for-assistance', component: FALAssistanceComponent }
      ]
    },
    {path: 'programs/:id/archive-request', component: FALFormArchiveRequestComponent},
  );
}
export const routing = RouterModule.forChild(routes);
