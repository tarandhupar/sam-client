import { Routes, RouterModule } from '@angular/router';
import { ReportsPage } from './reports.page';
import { OverviewComponent } from './sections/overview/overview.component';
import { ScheduledComponent } from './sections/overview/scheduled/scheduled.component';
import { ReportComponent } from './sections/report/report.component';
import { AdhocComponent } from './sections/adhoc/adhoc.component';
import { FavoritesComponent } from './sections/favorites/favorites.component';
import { StaticComponent } from './sections/static/static.component';
import { MyReportsComponent } from './sections/myreports/myreports.component';


export const routes: Routes = [
  {
    path: '',
    component: ReportsPage,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'scheduled', component: ScheduledComponent },
      { path: 'static', component: StaticComponent },
      { path: 'adhoc', component: AdhocComponent },
      { path: 'favorites', component: FavoritesComponent },
      { path: 'report/:id', component: ReportComponent },
      { path: 'myreports', component: MyReportsComponent }
    ]
  },
];

export const routing = RouterModule.forChild(routes);
