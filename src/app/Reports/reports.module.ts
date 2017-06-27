import { Component, Output, EventEmitter, NgZone, NgModule, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { routing } from './reports.route';
import { ReportsPage } from './reports.page';
import { OverviewComponent } from './sections/overview/overview.component';
import { OverviewProtoComponent } from './sections/overviewProto/overviewProto.component';
import { ScheduledComponent } from './sections/overview/scheduled/scheduled.component';
import { ReportComponent } from './sections/report/report.component';
import { ReportProtoComponent } from './sections/reportProto/reportProto.component';
import { AdhocComponent } from './sections/adhoc/adhoc.component';
import { FavoritesComponent } from './sections/favorites/favorites.component';
import { StaticComponent } from './sections/static/static.component';
import { AppComponentsModule } from '../app-components/app-components.module';
import { MstrProtoComponent } from './sections/mstrProto/mstrProto.component';
import { AlertsModule } from '../alerts/alerts.module';
import { SamUIKitModule } from 'sam-ui-kit';
import { IAMService } from 'api-kit';
import { ReportsService } from 'api-kit';
import { SamAPIKitModule } from 'api-kit';
import { Router } from '@angular/router';
import { globals } from '../../app/globals.ts';
import { ReportsPipe } from './reports.pipe';
@NgModule({
  imports: [
    SamUIKitModule,
    BrowserModule,
    FormsModule,
    routing,
    AppComponentsModule,
    AlertsModule,
    SamAPIKitModule
  ],
  exports: [ ],
  declarations: [
    ReportsPage,
    OverviewComponent,
    OverviewProtoComponent,
    ScheduledComponent,
    ReportComponent,
    AdhocComponent,
    FavoritesComponent,
    StaticComponent,
    ReportsPipe,
    ReportProtoComponent,
    MstrProtoComponent
  ],
  providers: [IAMService, ReportsService],
})
export class ReportsModule {
public states = {
    isSignedIn: false
  };

  public user = null;

constructor(private _router: Router, private zone: NgZone, private api: IAMService) {
    this.zone.runOutsideAngular(() => {
      this.checkSession(() => {
        this.zone.run(() => {
          // Callback
        });
      });
    });
  }

checkSession(cb: () => void) {
    let vm = this;

    this.api.iam.user.get(function(user) {
      vm.states.isSignedIn = true;
      vm.user = user;
      cb();
    });
  }

}
