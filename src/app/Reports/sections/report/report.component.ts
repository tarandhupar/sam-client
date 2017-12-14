import { Component, NgZone, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { IAMService } from 'api-kit';
import { globals } from '../../app/globals';
import { Cookie } from 'ng2-cookies';
import all = protractor.promise.all;
import * as xmljs from 'xml-js';
import * as moment from 'moment';
import { OptionsType } from 'sam-ui-elements/src/ui-kit/types';
import * as base64 from 'base-64';
import { ReportsService } from 'api-kit';
import * as Cookies from 'js-cookie';
import { SamDateRangeComponent } from 'sam-ui-elements/src/ui-kit/form-controls/date-range';
import * as _ from 'lodash';

@Component({
  providers: [IAMService],
  templateUrl: './report.template.html',
})
export class ReportComponent implements OnInit {
  @ViewChild('samAccordionValue') samAccordionValue;
  @ViewChild('dateRange') dateRange: SamDateRangeComponent;
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
  data = {
    reports: []
  };
  url: SafeResourceUrl;
  totalReportCount: number = 0;
  organizationId: string = '';
  agencyPicker = [];
  showReport: boolean = false;
  dateRangeModel = {
    startDate: '',
    endDate:'',
  };
  usedPrompts = {
    dateRange: false,
    fHierarchy: false,
    includesBases: false,
    contractingRegion: false,
    orgId: false,
    agencyName: false,
    piid: false,
    state: false,
    country: false,
    fiscalYear: false,
    psc: false,
    descOfReq: false,
    locationCode: false,
    congressionalDistrictCode: false,
    rangePsc: false,
    naics: false,
    onlyAgency: false,
    fundedBy: false
  };
  officeId: any = '';
  agencyId: any = '';
  departmentId: any = '';
  piid: any = '';
  promptAnswersXML: any;
  contractingRegion: any = '';
  orgCode: any = "";
  orgCodeXML: any;
  includesBases: any;
  includesBasesXML: any;
  agencyName: any = "";
  agencyNameXML: any = "";
  basesOptions: OptionsType[] = [
    { name: 'all', label: 'All', value: 'all'},
    { name: 'basesOnly', label: 'Bases Only', value: 'basesOnly'}
  ];
  contractingRegionOptions: OptionsType[] = [{name:'empty', label: '', value: ''},{name:'00',label:'00',value:'00'},{name:'01',label:'01',value:'01'},{name:'02',label:'02',value:'02'},{name:'03',label:'03',value:'03'},{name:'04',label:'04',value:'04'},{name:'05',label:'05',value:'05'},{name:'06',label:'06',value:'06'},{name:'07',label:'07',value:'07'},{name:'08',label:'08',value:'08'},{name:'09',label:'09',value:'09'},{name:'1',label:'1',value:'1'},{name:'10',label:'10',value:'10'},{name:'11',label:'11',value:'11'},{name:'12',label:'12',value:'12'},{name:'13',label:'13',value:'13'},{name:'14',label:'14',value:'14'},{name:'15',label:'15',value:'15'},{name:'16',label:'16',value:'16'},{name:'17',label:'17',value:'17'},{name:'18',label:'18',value:'18'},{name:'19',label:'19',value:'19'},{name:'2',label:'2',value:'2'},{name:'20',label:'20',value:'20'},{name:'21',label:'21',value:'21'},{name:'22',label:'22',value:'22'},{name:'23',label:'23',value:'23'},{name:'24',label:'24',value:'24'},{name:'25',label:'25',value:'25'},{name:'26',label:'26',value:'26'},{name:'27',label:'27',value:'27'},{name:'28',label:'28',value:'28'},{name:'29',label:'29',value:'29'},{name:'3',label:'3',value:'3'},{name:'30',label:'30',value:'30'},{name:'32',label:'32',value:'32'},{name:'33',label:'33',value:'33'},{name:'34',label:'34',value:'34'},{name:'35',label:'35',value:'35'},{name:'36',label:'36',value:'36'},{name:'37',label:'37',value:'37'},{name:'38',label:'38',value:'38'},{name:'39',label:'39',value:'39'},{name:'4',label:'4',value:'4'},{name:'5',label:'5',value:'5'},{name:'50',label:'50',value:'50'},{name:'6',label:'6',value:'6'},{name:'60',label:'60',value:'60'},{name:'65',label:'65',value:'65'},{name:'7',label:'7',value:'7'},{name:'70',label:'70',value:'70'},{name:'75',label:'75',value:'75'},{name:'8',label:'8',value:'8'},{name:'9',label:'9',value:'9'},{name:'90',label:'90',value:'90'},{name:'99',label:'99',value:'99'},{name:'AC',label:'AC',value:'AC'},{name:'AF',label:'AF',value:'AF'},{name:'AK',label:'AK',value:'AK'},{name:'AZ',label:'AZ',value:'AZ'},{name:'BA',label:'BA',value:'BA'},{name:'BC',label:'BC',value:'BC'},{name:'BR',label:'BR',value:'BR'},{name:'C',label:'C',value:'C'},{name:'CA',label:'CA',value:'CA'},{name:'CE',label:'CE',value:'CE'},{name:'CI',label:'CI',value:'CI'},{name:'CN',label:'CN',value:'CN'},{name:'CO',label:'CO',value:'CO'},{name:'CR',label:'CR',value:'CR'},{name:'DC',label:'DC',value:'DC'},{name:'DN',label:'DN',value:'DN'},{name:'EA',label:'EA',value:'EA'},{name:'ER',label:'ER',value:'ER'},{name:'ES',label:'ES',value:'ES'},{name:'EU',label:'EU',value:'EU'},{name:'FA',label:'FA',value:'FA'},{name:'FP',label:'FP',value:'FP'},{name:'GP',label:'GP',value:'GP'},{name:'HQ',label:'HQ',value:'HQ'},{name:'ID',label:'ID',value:'ID'},{name:'IG',label:'IG',value:'IG'},{name:'II',label:'II',value:'II'},{name:'LC',label:'LC',value:'LC'},{name:'MP',label:'MP',value:'MP'},{name:'MT',label:'MT',value:'MT'},{name:'NC',label:'NC',value:'NC'},{name:'NE',label:'NE',value:'NE'},{name:'NM',label:'NM',value:'NM'},{name:'NR',label:'NR',value:'NR'},{name:'NV',label:'NV',value:'NV'},{name:'OC',label:'OC',value:'OC'},{name:'OR',label:'OR',value:'OR'},{name:'OS',label:'OS',value:'OS'},{name:'PC',label:'PC',value:'PC'},{name:'PN',label:'PN',value:'PN'},{name:'RM',label:'RM',value:'RM'},{name:'SC',label:'SC',value:'SC'},{name:'SE',label:'SE',value:'SE'},{name:'SR',label:'SR',value:'SR'},{name:'SW',label:'SW',value:'SW'},{name:'TC',label:'TC',value:'TC'},{name:'UC',label:'UC',value:'UC'},{name:'US',label:'US',value:'US'},{name:'UT',label:'UT',value:'UT'},{name:'W',label:'W',value:'W'},{name:'WH',label:'WH',value:'WH'},{name:'WO',label:'WO',value:'WO'},{name:'WR',label:'WR',value:'WR'},{name:'WY',label:'WY',value:'WY'}
  ];
  promptAnswersXMLSBG: any;
  departmentIdSBG: any = '';
  agencyIdSBG: any = '';
  officeIdSBG: any = '';
  locationConfig = {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    }
  };
  pscConfig = {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    }
  };
  location: any = {
    country: {
      key: '',
      value: ''
    },
    state: {
      key: '',
      value: ''
    } 
  };
  stateLabel: string = 'State Code';
  dateValidator: boolean = false;
  maxRange: any = '';
  currentReport: any = [];
  stateXML: any;
  countryXML: any;
  fiscalYearXML: any;
  localEnv: boolean = false;
  PVMAXRANGE = 1.000;
  REPORTMAXRANGE = 12.000;
  userOrg: any = [];
  autocompleteStateConfig: any = {
    serviceOptions:'USA', 
    keyValueConfig: { keyProperty: 'key', valueProperty: 'value' }
  }
  fiscalYear: string = '';
  dateRangeLabel: string = 'Date range correspond to the Date Signed on Procurement Awards';
  promptsAccordian: number = 0;
  psc: any = {
    key: '',
    value: ''
  };
  pscValues: string;
  pscValidator: boolean = false;
  descOfReq: string = '';
  hasFpds: boolean = true;
  congressionalDistrictCode: any = '';
  locationCode: any = '';
  dateValidatorMsg: string;
  anomaly: boolean = false;
  lasaReport: boolean = false;
  rangePscFrom;
  rangePscTo;
  label = {
    pscFrom: '',
    pscTo: '',
    naics: '',
    fundedBy: ''
  }
  naics;
  fundedByOptions: OptionsType[] = [
    { name: 'fundingAgency', label: 'Click here to show the awards funded by the selected Sub-Tier. ', value: 'fundedBy'}
  ]
  onlyAgency = '';
  fundedBy;

  constructor(
    private route: ActivatedRoute, private router: Router, private zone: NgZone, private api: IAMService, private sanitizer: DomSanitizer, private reportsService: ReportsService, private http: Http) {
    this.zone.runOutsideAngular(() => {
      this.checkSession(() => {
        this.zone.run(() => {
          // Callback
        });
      });
    });

    http.get('src/assets/report-configs/'+REPORT_MICRO_STRATEGY_ENV+'-reports.json')
      .map(res => res.json())
      .subscribe(data => {
          this.data = data
          this.currentReport = _.filter(this.data.reports, {id: this.id})
          this.name = this.currentReport[0].name;
          this.expid = this.currentReport[0].expid;
          if (this.currentReport[0].prompts.indexOf('dateRange') >= 0) {
            this.usedPrompts.dateRange = true;
          }
          if (this.currentReport[0].prompts.indexOf('fHierarchy') >= 0) {
            this.usedPrompts.fHierarchy = true;
          }
          if (this.currentReport[0].prompts.indexOf('includesBases') >= 0) {
            this.usedPrompts.includesBases = true;
          }
          if (this.currentReport[0].prompts.indexOf('contractingRegion') >= 0) {
            this.usedPrompts.contractingRegion = true;
          }
          if (this.currentReport[0].prompts.indexOf('orgId') >= 0) {
            this.usedPrompts.orgId = true;
          }
          if (this.currentReport[0].prompts.indexOf('agencyName') >= 0) {
            this.usedPrompts.agencyName = true;
          }
          if (this.currentReport[0].prompts.indexOf('piid') >= 0) {
            this.usedPrompts.piid = true;
          }
          if (this.currentReport[0].prompts.indexOf('country') >= 0) {
            this.usedPrompts.country = true;
          }
          if (this.currentReport[0].prompts.indexOf('state') >= 0) {
            this.usedPrompts.state = true;
          }
          if (this.currentReport[0].prompts.indexOf('fiscalYear') >= 0) {
            this.usedPrompts.fiscalYear = true;
          }
          if (this.currentReport[0].prompts.indexOf('descOfReq') >= 0) {
            this.usedPrompts.descOfReq = true;
          }
          if (this.currentReport[0].prompts.indexOf('psc') >= 0) {
            this.usedPrompts.psc = true;
          }
          if (this.currentReport[0].prompts.indexOf('locationCode') >= 0) {
            this.usedPrompts.locationCode = true;
          }
          if (this.currentReport[0].prompts.indexOf('congressionalDistrictCode') >= 0) {
            this.usedPrompts.congressionalDistrictCode = true;
          }
          if (this.currentReport[0].prompts.indexOf('rangePsc') >= 0) {
            this.usedPrompts.rangePsc = true;
            this.label.pscFrom = 'From PSC';
            this.label.pscTo = 'To PSC';
          }
          if (this.currentReport[0].prompts.indexOf('naics') >= 0) {
            this.usedPrompts.naics = true;
            this.label.naics = 'NAICS Code';
          }
          if (this.currentReport[0].prompts.indexOf('onlyAgency') >= 0) {
            this.usedPrompts.onlyAgency = true;
          }
          if (this.currentReport[0].prompts.indexOf('fundedBy') >= 0) {
            this.usedPrompts.fundedBy = true;
            this.label.fundedBy = 'Funded By:'
          }
        },
        err => console.log(err));
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.route.queryParams.subscribe(
      data => {
        this.organizationId = typeof data['organizationId'] === "string" ? decodeURI(data['organizationId']) : "";
      });

    // Data range label for 'Inherently Governmental Functions Actions and Dollars Report'
    if (this.id === 'BE206C4B4A24C65846C6A686B576860F') {
      this.dateRangeLabel = '"From Date" and "To Date" correspond to the "Date Signed" on Procurement Awards. Procurement Awards started accepting data for "Inherently Governmental Functions" with a "Date Signed" on or later than March 1, 2012.'
    } else if (this.id === 'A733895D42D56A54679F95B20133D3C9') {
      this.dateRangeLabel = '"From Date" and "To Date" correspond to the "Date Signed" on the FPDS-NG documents.  This report is available starting from August 4, 2006.'
    // Date range label for 'Small Business Competitiveness Demonstration Report
    } else if (this.id === '65E6AD4B4192089B061D52BB09180083') {
      this.dateRangeLabel = '"From Date" and "To Date" correspond to the "Date Signed" on the FPDS-NG documents.  \nThe entire FY 2011 can be selected in the Report Criteria. However, no records will be displayed with a "Date Signed" after January 31, 2011.'
    }

    if (API_UMBRELLA_URL && API_UMBRELLA_URL.indexOf("reisys") != -1) {
       this.localEnv = true;
    }
    
    // Sets state prompt name based on specific report
    if (this.id === '48EC50F946E3011C5DE470A6FEA8C1FD') {
      this.stateLabel = 'Vendor State Code';
    }

    // Sets order of prompts for Local Area Set Aside Report
    if(this.id === 'A733895D42D56A54679F95B20133D3C9') {
      this.lasaReport = true;
    }

    // checks to see if anomaly report
    if (this.id === '30E9D5A24FC224CB444EA3A73F890870' || 
        this.id === 'C7501F5C4988E1B55275D48A5E0210B0' || 
        this.id === 'F23604FF4ED54C074D21AF821AE30708' || 
        this.id === 'FCB29AE64D9294F7B5CB07AFE163A201' || 
        this.id === '64E8D76F472295093086EA863D33A490' || 
        this.id === '8C4B7A8D4BCA80D42EEDC3800C47499F') {
      this.anomaly = true;
    }
  }      

  checkSession(cb: () => void) {
    let vm = this;
    this.api.iam.user.get(function (user) {
      vm.states.isSignedIn = true;
      vm.user = user;
      if (vm.user.departmentID) {
        vm.userOrg.push(vm.user.departmentID);
        if (vm.user.agencyID) {
          vm.userOrg.push(vm.user.agencyID);
        }
        vm.agencyPicker = vm.userOrg;
      }
      cb();
    });
  }

  validate(evt) {
    var startComparison = moment(this.dateRangeModel.startDate);
    var endComparison = moment(this.dateRangeModel.endDate);
    var duration = moment.duration(endComparison.diff(startComparison));
    if (this.name === "Potential Vendor Anomaly Report" && (duration.years() >= this.PVMAXRANGE)) {
      this.dateValidatorMsg = "A Date Range can not exceed 12 months.  Please refine your date criteria."
      this.dateValidator = true;
    } else if (this.name === "Procurement History for Market Research Report" && (!this.psc || this.psc.key.length === 0)) {
      this.pscValidator = true;
    } else if (this.name === "Local Area Set Aside Report" && moment(this.dateRangeModel.startDate).isBefore("2006-08-04")) {
      this.dateValidator = true;
      this.dateValidatorMsg = "This report is available starting from August 4, 2006";
    } else if (this.name === "Funding Report" && !this.onlyAgency) {
      this.dateValidator = true;
      this.dateValidatorMsg = "Sub-Tier is a required field.";
    }else if (duration.years() >= this.REPORTMAXRANGE) {
      this.dateValidatorMsg = "A Date Range can not exceed 12 years.  Please refine your date criteria."
      this.dateValidator = true;
    } else {
      this.dateValidator ? this.dateValidator = false : null;
      this.pscValidator ? this.pscValidator = false : null;
      this.exportOrExecute(evt);
    }
  }

  exportOrExecute(evt) {
    if (evt === "execute") {
      this.reportExecute();
    }
    if (evt === "export") {
      this.exportReport();
    }
  }

  reportExecute() {
    let vm = this;
    let startComparison = moment(this.dateRangeModel.startDate);
    let endComparison = moment(this.dateRangeModel.endDate);
    if ((startComparison.isValid() && endComparison.isValid() && startComparison<endComparison) || this.name == 'Contract Detail Report') {
      let evt = '4001';
      let reportId = "&reportId=" + this.id;
      vm.showReport = true;
      vm.samAccordionValue.collapseAll();
      this.hitUrl(evt, reportId);
    } else {
      // alert?
    }
  }

  exportReport() {
    let vm = this;
    let startComparison = moment(this.dateRangeModel.startDate);
    let endComparison = moment(this.dateRangeModel.endDate);
    if (this.contractingRegion == null) {
      this.contractingRegion = "";
    }
    
    if ((startComparison.isValid() && endComparison.isValid() && startComparison<endComparison) || this.name == 'Contract Detail Report') {
      let evt = '3069';
      let documentId = "&documentId=" + this.expid;
      vm.showReport = true;
      vm.samAccordionValue.collapseAll();
      this.hitUrl(evt, documentId);
    } else {
      // alert?
    }
  }

  hitUrl(evt, docId) {
    let vm = this;
    let project = 'SAM_IAE';
    // Change project for Unique Vendors Report
    if (this.id === 'F23604FF4ED54C074D21AF821AE30708') {
      project = 'SAM_NSF';
    }
    if (this.name === "Small Business Goaling Report") {
      vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl(REPORT_MICRO_STRATEGY_URL+REPORT_MICRO_STRATEGY_SERVER+'&Project=SAM_IAE&Port=8443&evt='+evt+'&src=mstrWeb.'+evt+'&currentViewMedia=1&visMode=0'+docId+'&iPlanetDirectoryPro='+Cookies.get('iPlanetDirectoryPro')+'&promptsAnswerXML='+this.generateXMLSBG()+"&v="+Date.now());
    } else if (this.name === "Contract Detail Report") {
      vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl(REPORT_MICRO_STRATEGY_URL+REPORT_MICRO_STRATEGY_SERVER+'&Project=SAM_IAE&Port=8443&evt='+evt+'&src=mstrWeb.'+evt+'&currentViewMedia=1&visMode=0'+docId+'&iPlanetDirectoryPro='+Cookies.get('iPlanetDirectoryPro')+'&promptsAnswerXML='+this.generateXMLCD()+"&v="+Date.now());
    } else if (this.name === "Funding Report") {
      vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl(REPORT_MICRO_STRATEGY_URL+REPORT_MICRO_STRATEGY_SERVER+'&Project=SAM_IAE&Port=8443&evt='+evt+'&src=mstrWeb.'+evt+'&currentViewMedia=1&visMode=0'+docId+'&iPlanetDirectoryPro='+Cookies.get('iPlanetDirectoryPro')+'&promptsAnswerXML='+this.generateXMLFundingReport()+"&v="+Date.now());
    } else {
      vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl(REPORT_MICRO_STRATEGY_URL+REPORT_MICRO_STRATEGY_SERVER+'&Project='+project+'&Port=8443&evt='+evt+'&src=mstrWeb.'+evt+'&currentViewMedia=1&visMode=0'+docId+'&iPlanetDirectoryPro='+Cookies.get('iPlanetDirectoryPro')+'&promptsAnswerXML='+this.generateXML()+"&v="+Date.now());
    }
  }

  generateXML() {
    this.departmentId = '';
    this.agencyId = '';
    this.officeId = '';
    if (this.agencyPicker) {
      for (let i in this.agencyPicker) {
        if (this.agencyPicker[i] && this.agencyPicker[i].type === 'DEPARTMENT') {
          let department: string = this.agencyPicker[i].fpdsCode || this.agencyPicker[i].fpdsOrgId;
          this.departmentId = [{type:"element",name:"at",attributes:{did:"092E3409421A8C76CCE01CB6E423BE3B",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"092E3409421A8C76CCE01CB6E423BE3B:"+department,art:"1"}}];
        }
        if (this.agencyPicker[i] && this.agencyPicker[i].type === 'AGENCY') {
          let agency: string = this.agencyPicker[i].fpdsCode || this.agencyPicker[i].fpdsOrgId;
          this.agencyId = [{type:"element",name:"at",attributes:{did:"A1FE94BE483FD8D534B145B794EC4166",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"A1FE94BE483FD8D534B145B794EC4166:"+agency,art:"1"}}];
        }
        if (this.agencyPicker[i] && this.agencyPicker[i].type === 'OFFICE') {
          let office: string = this.agencyPicker[i].fpdsCode || this.agencyPicker[i].fpdsOrgId;
          this.officeId = [{type:"element",name:"at",attributes:{did:"C556EB554CED80B514C5DFBC01CEFC5F",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"C556EB554CED80B514C5DFBC01CEFC5F:"+office,art:"1"}}];;
        }
      }
    }
    let orgCodePassed = encodeURIComponent(this.orgCode);
    let contractingRegionPasssed = encodeURIComponent(this.contractingRegion);
    this.promptAnswersXML = {elements:[{type:"element",name:"rsl",elements:[{type:"element",name:"pa",attributes:{pt:"5",pin:"0",did:"08C4877C401950B7A2D182B0B36801EC",tp:"10"},elements:[{type:"text",text:this.dateRangeModel.endDate}]},{type:"element",name:"pa",attributes:{pt:"5",pin:"0",did:"343002F84DD3741D37B81198047298B1",tp:"10"},elements:[{type:"text",text:this.dateRangeModel.startDate}]},{type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"3FCC554F4FE90D3221692D93AE98EBAE",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements:this.officeId}]}]},{type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"A009A1AF453DEBD6C1A3C7A6DD3CEE00",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements:this.agencyId}]}]},{type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"C1D7F68B4D09F29E00BE9EB436506CE6",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements:this.departmentId}]}]},{type:"element",name:"pa",attributes:{pt:"3",pin:"0",did:"E8B36A044628ECFA1B0677899EA10FD7",tp:"10"},elements:[{type:"text",text:contractingRegionPasssed}]},{type:"element",name:"pa",attributes:{pt:"3",pin:"0",did:"36B0D8F847186CF11E92829BF216055F",tp:"10"},elements:[{type:"text",text: orgCodePassed}]}]}]}

    // checks and adds prompt parameters for specific prompts
    this.checkIncludesBases();
    this.checkIncludesAgencyName();
    this.checkIncludesStateCountry();
    this.checkFiscalYear();
    this.checkPSC();
    this.checkDescOfRequirements()
    this.checkCongressionalDistrictCode();
    this.checkLocationCode();
    this.checkRangePsc();
    this.checkNaics();
    this.checkOnlyAgency();
    return xmljs.json2xml(this.promptAnswersXML);
  }

  generateXMLSBG() {
    this.departmentIdSBG = '';
    this.agencyIdSBG = '';
    this.officeIdSBG = '';
    if (this.agencyPicker) {
      for (let i in this.agencyPicker) {
        let department: string = this.agencyPicker[i].fpdsCode || this.agencyPicker[i].fpdsOrgId;
        if (this.agencyPicker[i] && this.agencyPicker[i].type === 'DEPARTMENT') {
          this.departmentIdSBG = [{type:"element",name:"at",attributes:{did:"FB2AB4B34DE1D7C3FD6BEA964061C99E",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"FB2AB4B34DE1D7C3FD6BEA964061C99E:"+department,art:"1"}}];
        }
        if (this.agencyPicker[i] && this.agencyPicker[i].type === 'AGENCY') {
          let agency: string = this.agencyPicker[i].fpdsCode || this.agencyPicker[i].fpdsOrgId;
          this.agencyIdSBG = [{type:"element",name:"at",attributes:{did:"26FAF0F343FB91A7A80566A1F7C37235",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"26FAF0F343FB91A7A80566A1F7C37235:" + agency,art:"1"}}];
        }
        if (this.agencyPicker[i] && this.agencyPicker[i].type === 'OFFICE') {
          let office: string = this.agencyPicker[i].fpdsCode || this.agencyPicker[i].fpdsOrgId;
          this.officeIdSBG = [{type:"element",name:"at",attributes:{did:"0156707745DF0346A1B8A7B0002BEBE0",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"0156707745DF0346A1B8A7B0002BEBE0:" + office,art:"1"}}];
        }
      }
    }
    this.promptAnswersXMLSBG = {elements:[{type:"element",name:"rsl",elements:[{type:"element",name:"pa",attributes:{pt:"5",pin:"0",did:"08C4877C401950B7A2D182B0B36801EC",tp:"10"},elements:[{type:"text",text:this.dateRangeModel.endDate}]},{type:"element",name:"pa",attributes:{pt:"5",pin:"0",did:"343002F84DD3741D37B81198047298B1",tp:"10"},elements:[{type:"text",text:this.dateRangeModel.startDate}]},{type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"1278B0C84122E77B3A943FB32283F4E8",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements:this.officeIdSBG}]}]},{type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"38E0F3C24FCD737B306391A201ED4504",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements:this.agencyIdSBG}]}]},{type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"E4A73C414350DDAB0D8854AB2492B47D",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements:this.departmentIdSBG}]}]},{type:"element",name:"pa",attributes:{pt:"3",pin:"0",did:"E8B36A044628ECFA1B0677899EA10FD7",tp:"10"},elements:[{type:"text",text:this.contractingRegion}]},{type:"element",name:"pa",attributes:{pt:"3",pin:"0",did:"36B0D8F847186CF11E92829BF216055F",tp:"10"},elements:[{type:"text",text:this.orgCode}]}]}]};
    return xmljs.json2xml(this.promptAnswersXMLSBG);
  }

  generateXMLCD() {
    this.promptAnswersXML = {elements:[{type:"element",name:"rsl",elements:[{type:"element",name:"pa",attributes:{pt:"3",pin:"0",did:"484D22974FA28152B5B0D3B11CA84E51",tp:"10"},elements:[{type:"text",text:this.piid.toUpperCase()}]},{type:"element",name:"pa",attributes:{pt:"3",pin:"0",did:"A56EAC9141786FE504C64892852F6F35",tp:"10"},elements:[{type:"text",text:this.piid.toUpperCase()}]}]}]};
    return xmljs.json2xml(this.promptAnswersXML);
  }

  generateXMLFundingReport() {
    this.promptAnswersXML = {elements:[{type:"element",name:"rsl",elements:[{type:"element",name:"pa",attributes:{pt:"5",pin:"0",did:"08C4877C401950B7A2D182B0B36801EC",tp:"10"},elements:[{type:"text",text:this.dateRangeModel.endDate}]},{type:"element",name:"pa",attributes:{pt:"5",pin:"0",did:"343002F84DD3741D37B81198047298B1",tp:"10"},elements:[{type:"text",text:this.dateRangeModel.startDate}]}]}]}
    this.checkOnlyAgency();
    return xmljs.json2xml(this.promptAnswersXML);
  }

  includesBasesStatusChange(status) {
    this.includesBases = status;
  }

  checkIncludesBases() {
    let basesBool = {};
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
      let encodedVendorName = encodeURIComponent(this.agencyName);
      let parameter = [];
      if (this.agencyName.length > 0) {
        parameter = [{type:"element",name:"at",attributes:{did:"1165DCC040CAA6686AC363B0F54E7D71",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"1165DCC040CAA6686AC363B0F54E7D71:"+encodedVendorName,art:"1"}}];
      }   
      this.agencyNameXML = {type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"1D31F4954BAFE2D81C6DF3A2FAEA5D91",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements: parameter}]}]}
      this.promptAnswersXML.elements[0].elements.push(this.agencyNameXML);
    }
  }

  checkIncludesStateCountry() {
    if (this.usedPrompts.state || this.usedPrompts.country) {
      let encodedStateVendor;
      let encodedStatePoP;
      let encodedCountryPoP;
      let encodedCountryVendor;
      let stateParameter = [];
      let countryParameter = [];
      let stateXMLid = '';
      let countryXMLid = '';
      if (this.location.state) {
        encodedStateVendor = encodeURIComponent(this.location.state.key);
        encodedStatePoP = encodeURIComponent(this.location.state.value);
      }
      if (this.location.country) {
        encodedCountryPoP = encodeURIComponent(this.location.country.value);
        encodedCountryVendor = encodeURIComponent(this.location.country.key);
      }
      // State code for geographical report by vendor location
      if (this.id === 'B1BA646F4E0BD167A588FBBC4E9E06A8' || this.id === '48EC50F946E3011C5DE470A6FEA8C1FD') {
        stateXMLid = 'C333A9D1438B941088B6898EEE811323';
        countryXMLid = '88E6E25643D1743D6DA8D395CE631FC2';
        if (this.location.state && this.location.state.value.length > 0) {
          stateParameter = [{type:"element",name:"at",attributes:{did:"EF87927B4C28EC072AD84389B81DEF63",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"EF87927B4C28EC072AD84389B81DEF63:"+encodedStateVendor.toUpperCase(),art:"1"}}];
        }
        if (this.location.country && this.location.country.value.length > 0) {
          countryParameter = [{type:"element",name:"at",attributes:{did:"2569E1F241BCE3414441DB81421A7B58",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"2569E1F241BCE3414441DB81421A7B58:"+encodedCountryVendor.toUpperCase(),art:"1"}}];
        }
      }
      // State code for geographical report by place of performance report
      if (this.id === 'DD333E194817ECA449A3AAA12511955F') { 
        stateXMLid = '79D5D8C241405AC36A4AAEB36CB4B62E';
        countryXMLid = 'D6D759164DCAC8BC56AAF88E3910C79A';
        if (this.location.state && this.location.state.value.length > 0) {
          stateParameter = [{type:"element",name:"at",attributes:{did:"E807038644FD59F5F131D8824F801A57",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"E807038644FD59F5F131D8824F801A57:"+encodedStateVendor.toUpperCase(),art:"1"}}];
        }
        if (this.location.country && this.location.country.value.length > 0) {
          countryParameter = [{type:"element",name:"at",attributes:{did:"07A44AB54A1A22DAA7D21C89B148CF15",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"07A44AB54A1A22DAA7D21C89B148CF15:"+encodedCountryPoP.toUpperCase(),art:"1"}}];
        }
      }

      // State code for Local Area Set Aside Report
      if (this.id === 'A733895D42D56A54679F95B20133D3C9') { 
        stateXMLid = '2642C82947F2A27C482311AE05BD198E';
        countryXMLid = '245645964C5D134C1E6EE89D94110D3F';
        if (this.location.state && this.location.state.value.length > 0) {
          stateParameter = [{type:"element",name:"at",attributes:{did:"E807038644FD59F5F131D8824F801A57",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"E807038644FD59F5F131D8824F801A57:"+encodedStateVendor.toUpperCase(),art:"1"}}];
        }
        if (this.location.country && this.location.country.value.length > 0) {
          countryParameter = [{type:"element",name:"at",attributes:{did:"C6527AEA47734553F264DABBE50886CC",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"C6527AEA47734553F264DABBE50886CC:"+encodedCountryPoP.toUpperCase(),art:"1"}}];
        }
      }
      
      this.stateXML = {type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:stateXMLid,tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements: stateParameter}]}]}
      this.promptAnswersXML.elements[0].elements.push(this.stateXML);

      this.countryXML = {type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:countryXMLid,tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements: countryParameter}]}]}
      this.promptAnswersXML.elements[0].elements.push(this.countryXML);
    }
  }

  checkFiscalYear() {
    if (this.usedPrompts.fiscalYear) {
      let fiscalYearXML = {};
      fiscalYearXML = {type:"element",name:"pa",attributes:{pt:"3",pin:"0",did:"187C72C645E80DDF3CBD83B287015D46",tp:"10"},elements:[{type:"text",text: this.fiscalYear}]}
      this.promptAnswersXML.elements[0].elements.push(fiscalYearXML);
    }
  }

  checkPSC() {
    if (this.usedPrompts.psc) {
      let pscXML = {};
      let pscParameter = [];
      if (this.psc && this.psc.key) {
          pscParameter = [{type:"element",name:"at",attributes:{did:"B1F7110C405E965C9C3804B084821825",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"B1F7110C405E965C9C3804B084821825:"+this.psc.key,art:"1"}}];
      }
      pscXML = {type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"9BB87E5045DF2B7D323EE38373FBA9C4",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements: pscParameter}]}]}
      this.promptAnswersXML.elements[0].elements.push(pscXML);
    }
  }

  checkDescOfRequirements() {
    if (this.usedPrompts.descOfReq) {
      let descOfReqXML = {};
      descOfReqXML = {type:"element",name:"pa",attributes:{pt:"3",pin:"0",did:"39119FE847CCD05479775585C460ABE9",tp:"10"},elements:[{type:"text",text:this.descOfReq.toUpperCase()}]}
      this.promptAnswersXML.elements[0].elements.push(descOfReqXML);
    }
  }

  checkCongressionalDistrictCode() {
    if (this.usedPrompts.congressionalDistrictCode) {
      let congressionalDistrictCodeXML = {};
      let congressionalDistrictCodeParameter;
      if (this.congressionalDistrictCode) {
        congressionalDistrictCodeParameter = [{type:"element",name:"at",attributes:{did:"73BE91FF4115D4E86739A1B8533B1396",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"73BE91FF4115D4E86739A1B8533B1396:"+this.congressionalDistrictCode,art:"1"}}];
      }
      congressionalDistrictCodeXML = {type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"54B19CFC4B6ACE00A2D9878971EC3FB4",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements: congressionalDistrictCodeParameter}]}]};
      this.promptAnswersXML.elements[0].elements.push(congressionalDistrictCodeXML);
    }
  }
  
  checkLocationCode() {
    if (this.usedPrompts.locationCode) {
      let locationCodeXML = {};
      let locationCodeParameter;
      if (this.locationCode) {
        locationCodeParameter = [{type:"element",name:"at",attributes:{did:"73A441B64E5147988C278996E39EF89B",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"73A441B64E5147988C278996E39EF89B:"+this.locationCode,art:"1"}}];
      }
      locationCodeXML = {type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"A19589464A41A7E77C76BCA7A6B64A4F",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements: locationCodeParameter}]}]};
      this.promptAnswersXML.elements[0].elements.push(locationCodeXML);
    }
  }
  
  checkRangePsc() {
    if (this.usedPrompts.rangePsc) {
      let rangePscFromXml = {};
      let rangePscToXml = {};
      let pscFrom = '';
      let pscTo = '';
      if (this.rangePscFrom && this.rangePscFrom.key) {
        pscFrom = this.rangePscFrom['key'];
      }
      if (this.rangePscTo && this.rangePscTo.key) {
        pscFrom = this.rangePscTo['key'];
      }
      rangePscFromXml = {type:"element",name:"pa",attributes:{pt:"3",pin:"0",did:"51A89B7F478F4B6AFD6A258A641DD4C2",tp:"10"},elements:[{type:"text",text: pscFrom}]}
      rangePscToXml = {type:"element",name:"pa",attributes:{pt:"3",pin:"0",did:"20FBACF348698BABB6BEBD8AAF49983E",tp:"10"},elements:[{type:"text",text: pscTo}]}
      this.promptAnswersXML.elements[0].elements.push(rangePscFromXml);
      this.promptAnswersXML.elements[0].elements.push(rangePscToXml);
    }
  }

  checkNaics() {
    if (this.usedPrompts.naics) {
      let naicsXML = {};
      let naicsParameter = [];
      if (this.naics && this.naics.key) {
          naicsParameter = [{type:"element",name:"at",attributes:{did:"16F77F8C4AB4C7984DAD909D0C5CF029",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"16F77F8C4AB4C7984DAD909D0C5CF029:"+this.naics.key,art:"1"}}];
      }
      naicsXML = {type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"7223463C45D038EF1C7873A66EDAF19F",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements: naicsParameter}]}]}
      this.promptAnswersXML.elements[0].elements.push(naicsXML);
    }
  }

  checkOnlyAgency() {
    if (this.usedPrompts.onlyAgency) {
      let onlyAgencyXML = {};
      let onlyAgencyParameter = [];
      let agencyPromptId = "E94D16164CA1A4F28F840790CCF8C501"
      let agencyPromptAnswerId = "A1FE94BE483FD8D534B145B794EC4166";
      if (this.fundedBy[0] === "fundedBy") {
        agencyPromptAnswerId = "4A57DB844892C977DB333B939EBA1B87";
        agencyPromptId = "2594DA9941865F5BE75172BCAB5097CC"
      }
      if (this.onlyAgency) {
          onlyAgencyParameter = [{type:"element",name:"at",attributes:{did:agencyPromptAnswerId,tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:agencyPromptAnswerId+":"+this.onlyAgency,art:"1"}}];
      }
      onlyAgencyXML = {type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:agencyPromptId,tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements: onlyAgencyParameter}]}]}
      this.promptAnswersXML.elements[0].elements.push(onlyAgencyXML);
    }
  }
  
  resetParameter(){ 
    this.showReport = false;
    this.agencyPicker = [];
    this.contractingRegion = '';
    this.orgCode = '';
    this.piid = '';
    this.agencyName = '';
    this.location.country = '';
    this.location.state = '';
    // Doesn't have dateRange
    if (this.name != 'Contract Detail Report') {
      this.dateRange.control.reset({
        "startDate": "",
        "endDate": ""
      });
    }
    this.dateValidator = false;
    this.psc = '';
    this.rangePscTo = '';
    this.rangePscFrom = '';
    this.descOfReq = '';
    this.locationCode = '';
    this.congressionalDistrictCode = ''; 
    this.naics = '';
  }

  updateCountryField(val) {
    this.location.country = val;
  }
  
  updateStateField(val) {
    this.location.state = val;
  }

  test() {
  }

  changeFundedBy($evt) {
    if (this.fundedBy[0] === "fundedBy") {
      this.id = 'A6ADD0BA4D183EEBC0C37D96153917A5';
      this.expid = '00808D974CD1D4001CA99CA7CCA9A354';
    } else {
      this.id = '8E6A40424FBD5B80A248D2B20E15983C';
      this.expid = '61FEA7214AE0C06854BCD4BBDA916A27';
    }
  }


  _keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  } 
}