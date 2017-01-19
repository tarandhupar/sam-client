import { Component, Output, EventEmitter, NgZone, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing } from './reports.route';
import { ReportsPage} from './reports.page';
import { OverviewComponent } from './sections/overview/overview.component';
import { ReportComponent } from './sections/report/report.component';
import { AdhocComponent } from './sections/adhoc/adhoc.component';
import { StaticComponent } from './sections/static/static.component';
import { SamUIKitModule } from "ui-kit/ui-kit.module";
import { ImageLibraryComponent } from "./image-library/image-library.component";
import { IAMService } from 'api-kit';
import { Router } from '@angular/router';
import { globals } from '../../app/globals.ts';
@NgModule({
  imports: [
    SamUIKitModule,
    BrowserModule,
    routing,
  ],
  exports: [ ImageLibraryComponent ],
  declarations: [
    ReportsPage,
    OverviewComponent,
    ReportComponent,
    AdhocComponent,
    StaticComponent,
    ImageLibraryComponent
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
   
    //console.log("user signed in?: "+this.states.isSignedIn);
  }

checkSession(cb: () => void) {
    let vm = this;

    this.api.iam.user.get(function(user) {
      vm.states.isSignedIn = true;
      //console.log("USER IS SIGNED IN: "+user.cn+"," +user.mail+"," +user.department);
      vm.user = user;
     // console.log("user signed in?: "+vm.states.isSignedIn);
      cb();
    });
  }

}
