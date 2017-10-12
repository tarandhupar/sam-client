import { Routes, RouterModule } from '@angular/router';
import {FALFormComponent} from "./fal-form.component";
import {FALFormResolver} from "./fal-form-resolver.service";
import {AuthGuard} from "../../../api-kit/authguard/authguard.service";

export const routes: Routes = [
  {
    path: 'programs/add',
    component: FALFormComponent,
    canDeactivate: [AuthGuard]
  },
  {
    path: 'programs/:id/edit',
    component: FALFormComponent,
    resolve: {
      fal: FALFormResolver,
    },
    canDeactivate: [AuthGuard]
  }
];

export const FALFormRoutes = RouterModule.forChild(routes);
