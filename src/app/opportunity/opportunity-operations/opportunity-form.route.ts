import { Routes, RouterModule } from '@angular/router';
import { OpportunityFormComponent } from "./opportunity-form.component";
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
      fal: OpportunityFormResolver
    }
  }
];

export const OpportunityFormRoutes = RouterModule.forChild(routes);
