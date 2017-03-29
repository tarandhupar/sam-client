import { Component, NgZone, NgModule  } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { IAMService } from 'api-kit';
import { globals } from '../../app/globals';
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
  private showReport:boolean = false;
  public states = {
    isSignedIn: false
  };

  data: Object;
  totalReportCount: number = 0;

  public user = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,private zone: NgZone, private api: IAMService, private sanitizer: DomSanitizer, private http: Http
  ) {
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
      if(user._id == "TEST_Public_User"){
        vm.pwd = "Publictest!!123";
      }
      else if (user._id == "TEST_NASA_User"){
        vm.pwd = "NASA";
      }
      else if (user._id == "TEST_DOD_User"){
        vm.pwd = "DOD";
      }
      else if (user._id == "TEST_Sys_Admin"){
        vm.pwd = "SYSADMIN";
      }
      else if (user._id == "TEST_DOD_Admin"){
        vm.pwd = "abc123";
      }
      else{
        vm.pwd = "abc123";
      }
      //vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl("http://54.197.196.14:8080/MicroStrategy/servlet/mstrWeb?server=52.203.16.25&project=SAM+Prototype&evt=4001&uid="+vm.user._id+"&pwd="+vm.pwd+"&reportID="+vm.id);
      vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl("https://csp-microstrategy.sam.gov/MicroStrategy/servlet/mstrWeb?server=10.11.34.63&project=SAM+Prototype&evt=4001&uid="+vm.user._id+"&pwd="+vm.pwd+"&reportID="+vm.id);

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
