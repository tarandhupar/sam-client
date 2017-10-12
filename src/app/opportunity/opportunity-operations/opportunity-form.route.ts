import { Routes, RouterModule } from '@angular/router';
import { OpportunityFormComponent } from "./framework/form-component/opportunity-form.component";
import { OpportunityFormResolver } from "./opportunity-form-resolver.service";
import { OpportunityAuthGuard } from "../components/authgaurd/authguard.service";

export const routes: Routes = [
  {
    path: 'opp/add',
    component: OpportunityFormComponent,
    canActivate: [OpportunityAuthGuard]
  },
  {
    path: 'opp/:id/edit',
    component: OpportunityFormComponent,
    resolve: {
      opp: OpportunityFormResolver
    },
    canActivate: [OpportunityAuthGuard]
  }
];

export const OpportunityFormRoutes = RouterModule.forChild(routes);
