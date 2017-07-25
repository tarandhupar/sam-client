import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { IAMService } from 'api-kit';
import { globals } from '../../app/globals';
import { Cookie } from 'ng2-cookies';
import all = protractor.promise.all;
import * as xmljs from 'xml-js';
import * as moment from 'moment';
import { OptionsType } from 'sam-ui-kit/types';

@Component({
  providers: [IAMService],
  templateUrl: './reportProto.template.html',
})
export class ReportProtoComponent implements OnInit {
  @ViewChild('samAccordionValue') samAccordionValue;
  public id = null;
  public expid = null;
  public name = null;
  public desc = null;
  public pwd = null;
  public appendix = [];
  public states = {
    isSignedIn: false
  };
  public prompts: string;
  public user = null;
  data: Object;
  url: SafeResourceUrl;
  totalReportCount: number = 0;
  organizationId: string = '';
  agencyPicker = [];
  showReport: boolean = false;
  dateRange = {
    startDate: '',
    endDate:''
  };
  usedPrompts = {
    dateRange: false,
    fHierarchy: false,
    includesBases: false,
    contractingRegion: false,
    orgId: false,
    agencyName: false
  };
  officeId: any = '';
  agencyId: any = '';
  departmentId: any = '';
  promptAnswersXML;
  contractingRegion = "";
  orgCode = "";
  orgCodeXML;
  includesBases;
  includesBasesXML;
  agencyName = "";
  basesOptions: OptionsType[] = [
    { name: 'all', label: 'All', value: 'all'},
    { name: 'basesOnly', label: 'Bases Only', value: 'basesOnly'}
  ];

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
    let evt = '4001';
    let reportId = "&reportId=" + this.id;
    vm.showReport = true;
    vm.samAccordionValue.collapseAll();
    this.hitUrl(evt, reportId);
  }

  exportReport() {
    let vm = this;
    let evt = '3069';
    let documentId = "&documentId=" + this.expid;
    vm.showReport = true;
    vm.samAccordionValue.collapseAll();
    this.hitUrl(evt, documentId);
  }

  hitUrl(evt, docId) {
    let vm = this;
    // +'&role='+vm.user.gsaRAC[0] -- role disabled for now
    vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl('https://microstrategystg.helix.gsa.gov/OOB/servlet/mstrWeb?Server=MICROSTRATEGY-4_BI.PROD-LDE.BSP.GSA.GOV&Project=SAM_IAE&Port=8443&evt='+evt+'&src=mstrWeb.'+evt+'&currentViewMedia=1&visMode=0&uid='+vm.user._id+docId+'&promptsAnswerXML='+this.generateXML());
  }

  resetParameter(){ 
    this.showReport = false;
    this.agencyPicker = [];
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.expid = this.route.snapshot.params['expid'];
    this.name = this.route.snapshot.params['name'];
    this.desc = this.route.snapshot.params['desc'];
    this.prompts = this.route.snapshot.params['prompts'];
    if (this.prompts.indexOf('dateRange') >= 0) {
      this.usedPrompts.dateRange = true;
    }
    if (this.prompts.indexOf('fHierarchy') >= 0) {
      this.usedPrompts.fHierarchy = true;
    }
    if (this.prompts.indexOf('includesBases') >= 0) {
      this.usedPrompts.includesBases = true;
    }
    if (this.prompts.indexOf('contractingRegion') >= 0) {
      this.usedPrompts.contractingRegion = true;
    }
    if (this.prompts.indexOf('orgId') >= 0) {
      this.usedPrompts.orgId = true;
    }
    if (this.prompts.indexOf('agencyName') >= 0) {
      this.usedPrompts.agencyName = true;
    }
    this.route.queryParams.subscribe(
      data => {
        this.organizationId = typeof data['organizationId'] === "string" ? decodeURI(data['organizationId']) : "";
      });
  }

  generateXML() {
    if (this.agencyPicker) {
      for (let i in this.agencyPicker) {
        if (this.agencyPicker[i].name.includes('(D)')) {
          this.departmentId = [{type:"element",name:"at",attributes:{did:"5343F7064B266D77D4763CB55CF193E5",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"5343F7064B266D77D4763CB55CF193E5:"+this.agencyPicker[i].code,art:"1"}}];
        }
        if (this.agencyPicker[i].name.includes('(A)')) {
          this.agencyId = [{type:"element",name:"at",attributes:{did:"9909C3FF4C4E64A62A92DC991D69F2CD",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"9909C3FF4C4E64A62A92DC991D69F2CD:"+this.agencyPicker[i].code,art:"1"}}];
        }
        if (this.agencyPicker[i].name.includes('(L3)')) {
          this.officeId = [{type:"element",name:"at",attributes:{did:"54F94B1940759D1794E3A1BD3D9F54B0",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"54F94B1940759D1794E3A1BD3D9F54B0:"+this.agencyPicker[i].code,art:"1"}}];;
        }
      }
    }
    this.promptAnswersXML = {elements:[{type:"element",name:"rsl",elements:[{type:"element",name:"pa",attributes:{pt:"5",pin:"0",did:"08C4877C401950B7A2D182B0B36801EC",tp:"10"},elements:[{type:"text",text:this.dateRange.endDate}]},{type:"element",name:"pa",attributes:{pt:"5",pin:"0",did:"343002F84DD3741D37B81198047298B1",tp:"10"},elements:[{type:"text",text:this.dateRange.startDate}]},{type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"3FCC554F4FE90D3221692D93AE98EBAE",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements:this.departmentId}]}]},{type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"A009A1AF453DEBD6C1A3C7A6DD3CEE00",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements:this.agencyId}]}]},{type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"C1D7F68B4D09F29E00BE9EB436506CE6",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements:this.officeId}]}]},{type:"element",name:"pa",attributes:{pt:"3",pin:"0",did:"E8B36A044628ECFA1B0677899EA10FD7",tp:"10"},elements:[{type:"text",text:this.contractingRegion}]},{type:"element",name:"pa",attributes:{pt:"3",pin:"0",did:"36B0D8F847186CF11E92829BF216055F",tp:"10"},elements:[{type:"text",text:this.orgCode}]}]}]}
    this.checkIncludesBases();
    this.checkIncludesAgencyName();
    return xmljs.json2xml(this.promptAnswersXML);
  }

  includesBasesStatusChange(status) {
    this.includesBases = status;
  }

  checkIncludesBases() {
    let basesBool;
    if (this.usedPrompts.includesBases) {
      if (this.includesBases === "basesOnly") {
        basesBool = {type:"element",name:"fct",attributes:{qsr:"0",fcn:"0",cc:"1",sto:"1",pfc:"0",pcc:"1"},elements:[{type:"element",name:"f",attributes:{did:"3503C54C4A888FC05808BBBA626176BB",tp:"1"}}]}
      } else {
        basesBool = {type:"element",name:"fct",attributes:{qsr:"0",fcn:"0",cc:"0",sto:"1",pfc:"0",pcc:"0"}}
      }
      this.includesBasesXML = {type:"element",name:"pa",attributes:{pt:"6",pin:"0",did:"B9F089924537A060405BC6B00FF42017",tp:"10"},elements:[{type:"element",name:"mi",elements:[]}]}
      this.includesBasesXML.elements[0].elements.push(basesBool);
      this.promptAnswersXML.elements[0].elements.push(this.includesBasesXML);
    }
  }

  checkIncludesAgencyName() {
    if (this.usedPrompts.agencyName) {
      let agencyNameXML
      if (this.agencyName) {
        agencyNameXML = {type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"1D31F4954BAFE2D81C6DF3A2FAEA5D91",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements:[{type:"element",name:"at",attributes:{did:"325702214C591F58735CE080B4735878",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"325702214C591F58735CE080B4735878:"+this.agencyName,art:"1"}}]}]}]}
      }
      this.promptAnswersXML.elements[0].elements.push(agencyNameXML);
    }
  }

}