import { Component, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
import { bootstrap } from '@angular/platform/browser';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { IAMService } from 'api-kit';
import { globals } from '../../app/globals';

@Component({
  providers: [ IAMService ],
  templateUrl: './static.template.html',
})
export class StaticComponent {
  public states = {
    isSignedIn: false,
    showSignIn: true,
    isAdmin: false
  };
  data: Object;
  public liked = true;
  public user = null;
  selectedIdx = null;
  updateDownloadLinks(reportsArray) {
    for (let _i = 0; _i < reportsArray.reports.length; _i++) {
      reportsArray.reports[_i].loc =  'http://gsa-reporting.s3.amazonaws.com/' + reportsArray.reports[_i].loc;
      if (reportsArray.reports[_i].previousDates != null) {
        for (let _j = 0; _j < reportsArray.reports[_i].previousDates.length; _j++) {
          reportsArray.reports[_i].previousDates[_j].loc =  'http://gsa-reporting.s3.amazonaws.com/' +
            reportsArray.reports[_i].previousDates[_j].loc;
        }
      }
    }
    this.data = reportsArray;
  }
  constructor(private route: ActivatedRoute, private router: Router, private zone: NgZone, private api: IAMService,
              private sanitizer: DomSanitizer, private http: Http) {
    /*this.zone.runOutsideAngular(() => {
      this.checkSession(() => {
        this.zone.run(() => {
          // Callback
        });
      });
    });
    http.get('src/assets/staticReports.json')
      .map(res => res.json())
      .subscribe(data => this.data = data,
        err => console.log(err),
        () => this.updateDownloadLinks(this.data));*/
  }
  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.checkSession(() => {
        this.zone.run(() => {
          // Callback
        });
      });
    });
    this.http.get('src/assets/staticReports.json')
      .map(res => res.json())
      .subscribe(data => this.data = data,
        err => console.log(err),
        () => this.updateDownloadLinks(this.data));
  }
  checkSession(cb: () => void) {
    let vm = this;
    this.api.iam.user.get(function(user) {
      vm.states.isSignedIn = true;
      vm.user = user;
      cb();
    });
  }
  selectItem(index): void {
    this.selectedIdx = index;
    this.liked = !this.liked;
  }
}
