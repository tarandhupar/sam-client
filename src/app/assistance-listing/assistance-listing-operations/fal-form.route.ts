import { Routes, RouterModule } from '@angular/router';
import {FALFormComponent} from "./fal-form.component";
import {FALFormResolver} from "./fal-form-resolver.service";
import {FALAuthGuard} from "../components/authguard/authguard.service";

export const routes: Routes = [
  {
    path: 'programs/add',
    component: FALFormComponent,
    canActivate: [FALAuthGuard],
    canDeactivate: [FALAuthGuard]
  },
  {
    path: 'programs/:id/edit',
    component: FALFormComponent,
    resolve: {
      fal: FALFormResolver,
    },
    canActivate: [FALAuthGuard],
    canDeactivate: [FALAuthGuard]
  }
];

export const FALFormRoutes = RouterModule.forChild(routes);
