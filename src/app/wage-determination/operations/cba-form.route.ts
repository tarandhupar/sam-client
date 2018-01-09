import {Routes, RouterModule} from '@angular/router';
import {CBAFormComponent} from "./framework/form-component/cba-form.component";
import {CBAAuthGuard} from "../components/authguard/authguard.service";
import {CBAFormResolver} from "./cba-form-resolver.service";

export const routes: Routes = [
  {
    path: 'wage-determination/cba/add',
    component: CBAFormComponent,
    canActivate: [CBAAuthGuard]
  },
  {
    path: 'wage-determination/cba/:id/edit',
    component: CBAFormComponent,
    resolve: {
      cba: CBAFormResolver
    },
    canActivate: [CBAAuthGuard]
  }
];

export const CBAFormRoutes = RouterModule.forChild(routes);
