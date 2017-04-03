import { Component, NgZone, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { IAMService } from 'api-kit';
import { globals } from '../../app/globals';
import { Cookie } from 'ng2-cookies'
import all = protractor.promise.all;

@Component({
  providers: [IAMService],
  templateUrl: './report.template.html',

})
export class ReportComponent {
  public id = null;
  public name = null;
  public desc = null;
  public pwd = null;
  public appendix = [];
  url: SafeResourceUrl;
  public states = {
    isSignedIn: false
  };

  data: Object;
  totalReportCount: number = 0;

  public user = null;

  private showReport: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router, private zone: NgZone, private api: IAMService, private sanitizer: DomSanitizer,
    private http: Http) {
    this.zone.runOutsideAngular(() => {
      this.checkSession(() => {
        this.zone.run(() => {
          // Callback
        });
      });
    });
    http.get('src/assets/standardReport.json')
      .map(res => res.json())
      .subscribe(data => this.data = data,
        err => console.log(err),
        () => console.log('Completed'));
  }


  checkSession(cb: () => void) {
    let vm = this;

    this.api.iam.user.get(function(user) {
      vm.states.isSignedIn = true;
      vm.user = user;

      vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl
      ('https://csp-microstrategy.sam.gov/MicroStrategy/servlet/mstrWeb?&evt=4001&hiddensections=path,dockLeft,footer'
        +'&uid=' + vm.user._id + '&reportID=' + vm.id + '&role=' + vm.user.gsaRAC[0].role);

      cb();
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.name = this.route.snapshot.params['name'];
    this.desc = this.route.snapshot.params['desc'];
    this.showReport = true; // show iframe
  }

}
