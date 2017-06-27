import { Routes, RouterModule } from '@angular/router';
import {SampleFormComponent} from "./sample-form.component";
import {SampleFormResolver} from "./sample-form-resolver.service";

export const routes: Routes = [];

if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({
    path: 'sampleForm/add',
    component: SampleFormComponent
  });
  routes.unshift({
    path: 'sampleForm/:id/edit',
    component: SampleFormComponent,
    resolve: {
      data: SampleFormResolver
    }
  });
}

export const SampleFormRoutes = RouterModule.forChild(routes);
