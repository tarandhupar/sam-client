import { Component, NgZone, NgModule  } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { IAMService } from 'api-kit';
import { globals } from '../../app/globals.ts';
import * as Cookies from 'js-cookie';

@Component({
    providers: [IAMService],
    templateUrl: './myreports.template.html'
})
export class MyReportsComponent {
    url: SafeResourceUrl;
    states = {
        isSignedIn: false
    }
    user = null;
    showReport: boolean = false;
    constructor(
            private route: ActivatedRoute,
            private router: Router, private zone: NgZone, private api: IAMService, private sanitizer: DomSanitizer
    ) {
        this.zone.runOutsideAngular(() => {
            this.checkSession(() => {
                this.zone.run(() => {

                });
            });
        });
    }
    checkSession(cb: () => void) {
    let vm = this;
    this.api.iam.user.get(function(user) {
    vm.states.isSignedIn = true;
    vm.user = user;
    vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl
    (REPORT_MICRO_STRATEGY_URL+REPORT_MICRO_STRATEGY_SERVER+'&Project=SAM_IAE&Port=8443&evt=2001&systemFolder=20&iPlanetDirectoryPro='+Cookies.get('iPlanetDirectoryPro'));
      cb();
    });
  }

  ngOnInit() {
    this.showReport = true;
  }
}