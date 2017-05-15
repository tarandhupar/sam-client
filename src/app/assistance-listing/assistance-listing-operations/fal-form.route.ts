import { Routes, RouterModule } from '@angular/router';
import {FALFormComponent} from "./fal-form.component";
import {FALFormResolver} from "./fal-form-resolver.service";

export const routes: Routes = [
  {
    path: 'programsForm/add',
    component: FALFormComponent
  },
  {
    path: 'programsForm/:id/edit',
    component: FALFormComponent,
    resolve: {
      fal: FALFormResolver
    }
  }
];

export const FALFormRoutes = RouterModule.forChild(routes);
