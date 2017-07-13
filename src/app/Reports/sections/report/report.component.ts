import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { IAMService } from 'api-kit';
import { globals } from '../../app/globals';
import { Cookie } from 'ng2-cookies';
import all = protractor.promise.all;

@Component({
  providers: [IAMService],
  templateUrl: './report.template.html',

})
export class ReportComponent implements OnInit {
  @ViewChild('samAccordionValue') samAccordionValue;
  @ViewChild('agencyPicker') agencyPicker;
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
  organizationId:string = '';
  agencyPickerValue = [];
  dateFromModel = '';
  dateToModel = '';

  showReport: boolean = false;

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
      this.api.iam.user.get(function (user) {
        vm.states.isSignedIn = true;
        vm.user = user;
        vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl
        ('https://microstrategydev.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?Server=MICROSTRATEGY-3_BI.PROD-LDE.BSP.GSA.GOV&Project=SAM_IAE&Port=8443&evt=4001&src=mstrWeb.4001&visMode=0&reportViewMode=1&reportSubtype=768'
          + '&uid=' + vm.user._id + '&reportID=' + vm.route.snapshot.params['id'] + '&role=' + vm.user.gsaRAC[0] + 'reportSubtype=768');
        cb();
      });
    }
  reportExecute() {
    let vm = this;
    vm.showReport = true;
    vm.samAccordionValue.collapseAll();
    // vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl
    // ('https://microstrategydev.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?&evt=4001&hiddensections=path,dockLeft,footer'
    //   + '&uid=' + vm.user._id + '&reportID=' + vm.route.snapshot.params['id'] + '&role=' + vm.user.gsaRAC[0].role);
    console.log(vm.dateFromModel);
    console.log(vm.dateToModel);
    console.log(vm.agencyPicker);

  }
  resetParameter(){
    this.agencyPicker.resetBrowse();
    this.showReport = false;
    this.agencyPickerValue = [];
    this.dateFromModel = '';
    this.dateToModel = '';

  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.name = this.route.snapshot.params['name'];
    this.desc = this.route.snapshot.params['desc'];
    this.showReport = true;

    this.route.queryParams.subscribe(
      data => {

        this.organizationId = typeof data['organizationId'] === "string" ? decodeURI(data['organizationId']) : "";

      });
  }

  // handles 'organization' emmitted event from agency picker
  onOrganizationChange(orgId:any){

    let organizationStringList = '';

    let stringBuilderArray = orgId.map(function (organizationItem) {
      if(organizationStringList === ''){
        organizationStringList += organizationItem.value;
      }
      else{
        organizationStringList += ',' + organizationItem.value;
      }

      return organizationStringList;
    });



  }


}
