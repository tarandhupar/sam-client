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
    mstrEnv;
    mstrServer;
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
    if (API_UMBRELLA_URL && (API_UMBRELLA_URL.indexOf("/prod") != -1 || API_UMBRELLA_URL.indexOf("/prodlike") != -1)) {
      vm.mstrEnv = 'stg';
      vm.mstrServer = 'MICROSTRATEGY-4_BI.PROD-LDE.BSP.GSA.GOV';
    } else if (API_UMBRELLA_URL && API_UMBRELLA_URL.indexOf("/minc") != -1) {
      vm.mstrEnv = 'test';
      vm.mstrServer = 'MICROSTRATEGY-2_BI.PROD-LDE.BSP.GSA.GOV';
    } else if (API_UMBRELLA_URL && API_UMBRELLA_URL.indexOf("/comp") != -1) {
      vm.mstrEnv = 'dev';
      vm.mstrServer = 'MICROSTRATEGY-3_BI.PROD-LDE.BSP.GSA.GOV';
    }
    vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl
    ('https://microstrategy'+vm.mstrEnv+'.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?Server='+vm.mstrServer+'&Project=SAM_IAE&Port=8443&evt=2001&systemFolder=20&iPlanetDirectoryPro='+Cookies.get('iPlanetDirectoryPro'));
      cb();
    });
  }

  ngOnInit() {
    this.showReport = true;
  }
}