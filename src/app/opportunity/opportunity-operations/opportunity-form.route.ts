import { Routes, RouterModule } from '@angular/router';
import { OpportunityFormComponent } from "./framework/form-component/opportunity-form.component";
import { OpportunityFormResolver } from "./opportunity-form-resolver.service";

export const routes: Routes = [
  {
    path: 'opportunities/add',
    component: OpportunityFormComponent
  },
  {
    path: 'opportunities/:id/edit',
    component: OpportunityFormComponent,
    resolve: {
      opp: OpportunityFormResolver
    }
  }
];

export const OpportunityFormRoutes = RouterModule.forChild(routes);
