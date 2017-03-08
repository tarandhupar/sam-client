import { Component, Output, EventEmitter, NgZone, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing } from './reports.route';
import { ReportsPage } from './reports.page';
import { OverviewComponent } from './sections/overview/overview.component';
import { ReportComponent } from './sections/report/report.component';
import { AdhocComponent } from './sections/adhoc/adhoc.component';
import { StaticComponent } from './sections/static/static.component';
import { SamUIKitModule } from 'sam-ui-kit';
import { IAMService } from 'api-kit';
import { Router } from '@angular/router';
import { globals } from '../../app/globals.ts';
@NgModule({
  imports: [
    SamUIKitModule,
    BrowserModule,
    routing,
  ],
  exports: [ ],
  declarations: [
    ReportsPage,
    OverviewComponent,
    ReportComponent,
    AdhocComponent,
    StaticComponent
  ],
  providers: [IAMService],
})
export class ReportsModule{
public states = {
    isSignedIn: false
  };

  public user = null;

constructor(private _router:Router, private zone: NgZone, private api: IAMService) {
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
