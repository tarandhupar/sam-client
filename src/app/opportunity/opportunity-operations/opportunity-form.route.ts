import { Routes, RouterModule } from '@angular/router';
import { OpportunityFormComponent } from "./framework/form-component/opportunity-form.component";
import { OpportunityFormResolver } from "./opportunity-form-resolver.service";
import { OpportunityAuthGuard } from "../components/authgaurd/authguard.service";

export const routes: Routes = [
  {
    path: 'add',
    component: OpportunityFormComponent,
    canActivate: [OpportunityAuthGuard]
  },
  {
    path: ':id/edit',
    component: OpportunityFormComponent,
    resolve: {
      opp: OpportunityFormResolver
    },
    canActivate: [OpportunityAuthGuard]
  }
];

export const OpportunityFormRoutes = RouterModule.forChild(routes);
