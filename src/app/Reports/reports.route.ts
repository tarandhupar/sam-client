import { Routes, RouterModule } from '@angular/router';
import { ReportsPage } from './reports.page';
import { OverviewComponent } from './sections/overview/overview.component';
import { ScheduledComponent } from './sections/overview/scheduled/scheduled.component';
import { ReportComponent } from './sections/report/report.component';
import { AdhocComponent } from './sections/adhoc/adhoc.component';
import { FavoritesComponent } from './sections/favorites/favorites.component';
import { StaticComponent } from './sections/static/static.component';
import { MyReportsComponent } from './sections/overview/myreports/myreports.component';
import { SharedComponent } from './sections/shared/shared.component';


export const routes: Routes = [
  {
    path: '',
    component: ReportsPage,
    children: []
  }
];

if (ENABLE_REPORTING_AREA === 'true' || ENV === 'development') {
  routes[0].children.unshift({ path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'scheduled', component: ScheduledComponent },
      { path: 'static', component: StaticComponent },
      { path: 'adhoc', component: AdhocComponent },
      { path: 'favorites', component: FavoritesComponent },
      { path: ':id/view', component: ReportComponent },
      { path: 'myreports', component: MyReportsComponent },
      { path: 'shared/mstrWeb', component: SharedComponent })
}

export const routing = RouterModule.forChild(routes);
