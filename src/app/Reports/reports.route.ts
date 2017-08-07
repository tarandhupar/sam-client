import { Routes, RouterModule } from '@angular/router';
import { ReportsPage } from './reports.page';
import { OverviewComponent } from './sections/overview/overview.component';
import { OverviewProtoComponent } from './sections/overviewProto/overviewProto.component';
import { ScheduledComponent } from './sections/overview/scheduled/scheduled.component';
import { ReportComponent } from './sections/report/report.component';
import { ReportProtoComponent } from './sections/reportProto/reportProto.component';
import { AdhocComponent } from './sections/adhoc/adhoc.component';
import { FavoritesComponent } from './sections/favorites/favorites.component';
import { StaticComponent } from './sections/static/static.component';


export const routes: Routes = [
  {
    path: 'reports',
    component: ReportsPage,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewProtoComponent },
      { path: 'overviewProto', component: OverviewProtoComponent },
      { path: 'scheduled', component: ScheduledComponent },
      { path: 'static', component: StaticComponent },
      { path: 'adhoc', component: AdhocComponent },
      { path: 'favorites', component: FavoritesComponent },
      { path: 'report/:id/:name/:desc', component: ReportComponent },
      { path: 'reportProto/:id/:expid/:name/:desc/:prompts', component: ReportProtoComponent }
    ]
  },
];

export const routing = RouterModule.forChild(routes);
