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
  templateUrl: './reportProto.template.html',
})
export class ReportProtoComponent implements OnInit {
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
  public prompts: string;
  data: Object;
  totalReportCount: number = 0;
  public user = null;
  organizationId:string = '';
  agencyPickerValue = [];
  showReport: boolean = false;
  dateRange = {
    startDate: '',
    endDate:''
  };
  usedPrompts = {
    dateRange: false,
    fHierarchy: false
  };

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
      cb();
    });
  }

  reportExecute() {
    let vm = this;
    let promptAnswers = '';

    console.log(this.agencyPicker);

    if(this.agencyPicker.selectedOrganizations.length > 0) {
      promptAnswers = '%3Crsl%3E%3Cpa%20pt%3D%225%22%20pin%3D%220%22%20did%3D%2208C4877C401950B7A2D182B0B36801EC%22%20tp%3D%2210%22%3E'+this.dateRange.endDate+'%3C%2Fpa%3E%3Cpa%20pt%3D%225%22%20pin%3D%220%22%20did%3D%22343002F84DD3741D37B81198047298B1%22%20tp%3D%2210%22%3E'+this.dateRange.startDate+'%3C%2Fpa%3E%3Cpa%20pt%3D%227%22%20pin%3D%220%22%20did%3D%22A009A1AF453DEBD6C1A3C7A6DD3CEE00%22%20tp%3D%2210%22%3E%3Cmi%3E%3Ces%20%2F%3E%3C%2Fmi%3E%3C%2Fpa%3E%3Cpa%20pt%3D%227%22%20pin%3D%220%22%20did%3D%22C1D7F68B4D09F29E00BE9EB436506CE6%22%20tp%3D%2210%22%3E%3Cmi%3E%3Ces%3E%3Cat%20did%3D%225343F7064B266D77D4763CB55CF193E5%22%20tp%3D%2212%22%20%2F%3E%3Ce%20emt%3D%221%22%20ei%3D%225343F7064B266D77D4763CB55CF193E5%3A'+this.agencyPicker.selectedOrganizations[0].code+'%22%20art%3D%221%22%20%2F%3E%3C%2Fes%3E%3C%2Fmi%3E%3C%2Fpa%3E%3C%2Frsl%3E';
    } else {
      promptAnswers = '%3Crsl%3E%3Cpa%20pt%3D%225%22%20pin%3D%220%22%20did%3D%2208C4877C401950B7A2D182B0B36801EC%22%20tp%3D%2210%22%3E'+this.dateRange.endDate+'%3C%2Fpa%3E%3Cpa%20pt%3D%225%22%20pin%3D%220%22%20did%3D%22343002F84DD3741D37B81198047298B1%22%20tp%3D%2210%22%3E'+this.dateRange.startDate+'%3C%2Fpa%3E%3Cpa%20pt%3D%227%22%20pin%3D%220%22%20did%3D%22A009A1AF453DEBD6C1A3C7A6DD3CEE00%22%20tp%3D%2210%22%3E%3Cmi%3E%3Ces%20%2F%3E%3C%2Fmi%3E%3C%2Fpa%3E%3Cpa%20pt%3D%227%22%20pin%3D%220%22%20did%3D%22C1D7F68B4D09F29E00BE9EB436506CE6%22%20tp%3D%2210%22%3E%3Cmi%3E%3Ces%20%2F%3E%3C%2Fmi%3E%3C%2Fpa%3E%3C%2Frsl%3E'
    }
    
    vm.showReport = true;
    vm.samAccordionValue.collapseAll();
    vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl('https://microstrategydev.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?Server=MICROSTRATEGY-3_BI.PROD-LDE.BSP.GSA.GOV&Project=SAM_IAE&Port=8443&evt=2048001&src=mstrWeb.2048001&currentViewMedia=1&visMode=0'
          + '&uid=' + vm.user._id + '&documentID=' + vm.route.snapshot.params['id'] +  '&role=' + vm.user.gsaRAC[0] + '&promptsAnswerXML=' +promptAnswers);
  }

  resetParameter(){
    this.agencyPicker.resetBrowse();
    this.showReport = false;
    this.agencyPickerValue = [];
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.name = this.route.snapshot.params['name'];
    this.desc = this.route.snapshot.params['desc'];
    this.prompts = this.route.snapshot.params['prompts'];
    if (this.prompts.indexOf('dateRange') >= 0) {
      this.usedPrompts.dateRange = true;
    }
    if (this.prompts.indexOf('fHierarchy') >= 0) {
      this.usedPrompts.fHierarchy = true;
    }
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
      console.log(orgId);
      return organizationStringList;
    });
  }
  orgFullPath($evt) {
    console.log
  }
}

