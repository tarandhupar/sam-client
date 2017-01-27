import { Routes, RouterModule } from '@angular/router';
import { ReportsPage } from './reports.page';
import { OverviewComponent } from './sections/overview/overview.component';
import { ReportComponent } from './sections/report/report.component';
import { AdhocComponent } from './sections/adhoc/adhoc.component';
import { StaticComponent } from './sections/static/static.component';


export const routes: Routes = [
  {
    path: 'reports',
    component: ReportsPage,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'static', component: StaticComponent },
      { path: 'adhoc', component: AdhocComponent },
      { path: 'report/:id/:name/:desc', component: ReportComponent },
    ]
  },
];

export const routing = RouterModule.forChild(routes);
