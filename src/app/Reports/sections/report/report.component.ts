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
import * as base64 from 'base-64';
import { ReportsService } from 'api-kit';
import * as Cookies from 'js-cookie';
import { SamDateRangeComponent } from 'sam-ui-kit/form-controls/date-range';
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
    country: false
  };
  officeId: any = '';
  agencyId: any = '';
  departmentId: any = '';
  piid = '';
  promptAnswersXML;
  contractingRegion = '';
  orgCode = "";
  orgCodeXML;
  includesBases;
  includesBasesXML;
  agencyName = "";
  agencyNameXML: any = "";
  basesOptions: OptionsType[] = [
    { name: 'all', label: 'All', value: 'all'},
    { name: 'basesOnly', label: 'Bases Only', value: 'basesOnly'}
  ];
  contractingRegionOptions: OptionsType[] = [{name:'empty', label: '', value: ''},{name:'00',label:'00',value:'00'},{name:'01',label:'01',value:'01'},{name:'02',label:'02',value:'02'},{name:'03',label:'03',value:'03'},{name:'04',label:'04',value:'04'},{name:'05',label:'05',value:'05'},{name:'06',label:'06',value:'06'},{name:'07',label:'07',value:'07'},{name:'08',label:'08',value:'08'},{name:'09',label:'09',value:'09'},{name:'1',label:'1',value:'1'},{name:'10',label:'10',value:'10'},{name:'11',label:'11',value:'11'},{name:'12',label:'12',value:'12'},{name:'13',label:'13',value:'13'},{name:'14',label:'14',value:'14'},{name:'15',label:'15',value:'15'},{name:'16',label:'16',value:'16'},{name:'17',label:'17',value:'17'},{name:'18',label:'18',value:'18'},{name:'19',label:'19',value:'19'},{name:'2',label:'2',value:'2'},{name:'20',label:'20',value:'20'},{name:'21',label:'21',value:'21'},{name:'22',label:'22',value:'22'},{name:'23',label:'23',value:'23'},{name:'24',label:'24',value:'24'},{name:'25',label:'25',value:'25'},{name:'26',label:'26',value:'26'},{name:'27',label:'27',value:'27'},{name:'28',label:'28',value:'28'},{name:'29',label:'29',value:'29'},{name:'3',label:'3',value:'3'},{name:'30',label:'30',value:'30'},{name:'32',label:'32',value:'32'},{name:'33',label:'33',value:'33'},{name:'34',label:'34',value:'34'},{name:'35',label:'35',value:'35'},{name:'36',label:'36',value:'36'},{name:'37',label:'37',value:'37'},{name:'38',label:'38',value:'38'},{name:'39',label:'39',value:'39'},{name:'4',label:'4',value:'4'},{name:'5',label:'5',value:'5'},{name:'50',label:'50',value:'50'},{name:'6',label:'6',value:'6'},{name:'60',label:'60',value:'60'},{name:'65',label:'65',value:'65'},{name:'7',label:'7',value:'7'},{name:'70',label:'70',value:'70'},{name:'75',label:'75',value:'75'},{name:'8',label:'8',value:'8'},{name:'9',label:'9',value:'9'},{name:'90',label:'90',value:'90'},{name:'99',label:'99',value:'99'},{name:'AC',label:'AC',value:'AC'},{name:'AF',label:'AF',value:'AF'},{name:'AK',label:'AK',value:'AK'},{name:'AZ',label:'AZ',value:'AZ'},{name:'BA',label:'BA',value:'BA'},{name:'BC',label:'BC',value:'BC'},{name:'BR',label:'BR',value:'BR'},{name:'C',label:'C',value:'C'},{name:'CA',label:'CA',value:'CA'},{name:'CE',label:'CE',value:'CE'},{name:'CI',label:'CI',value:'CI'},{name:'CN',label:'CN',value:'CN'},{name:'CO',label:'CO',value:'CO'},{name:'CR',label:'CR',value:'CR'},{name:'DC',label:'DC',value:'DC'},{name:'DN',label:'DN',value:'DN'},{name:'EA',label:'EA',value:'EA'},{name:'ER',label:'ER',value:'ER'},{name:'ES',label:'ES',value:'ES'},{name:'EU',label:'EU',value:'EU'},{name:'FA',label:'FA',value:'FA'},{name:'FP',label:'FP',value:'FP'},{name:'GP',label:'GP',value:'GP'},{name:'HQ',label:'HQ',value:'HQ'},{name:'ID',label:'ID',value:'ID'},{name:'IG',label:'IG',value:'IG'},{name:'II',label:'II',value:'II'},{name:'LC',label:'LC',value:'LC'},{name:'MP',label:'MP',value:'MP'},{name:'MT',label:'MT',value:'MT'},{name:'NC',label:'NC',value:'NC'},{name:'NE',label:'NE',value:'NE'},{name:'NM',label:'NM',value:'NM'},{name:'NR',label:'NR',value:'NR'},{name:'NV',label:'NV',value:'NV'},{name:'OC',label:'OC',value:'OC'},{name:'OR',label:'OR',value:'OR'},{name:'OS',label:'OS',value:'OS'},{name:'PC',label:'PC',value:'PC'},{name:'PN',label:'PN',value:'PN'},{name:'RM',label:'RM',value:'RM'},{name:'SC',label:'SC',value:'SC'},{name:'SE',label:'SE',value:'SE'},{name:'SR',label:'SR',value:'SR'},{name:'SW',label:'SW',value:'SW'},{name:'TC',label:'TC',value:'TC'},{name:'UC',label:'UC',value:'UC'},{name:'US',label:'US',value:'US'},{name:'UT',label:'UT',value:'UT'},{name:'W',label:'W',value:'W'},{name:'WH',label:'WH',value:'WH'},{name:'WO',label:'WO',value:'WO'},{name:'WR',label:'WR',value:'WR'},{name:'WY',label:'WY',value:'WY'}
  ];
  roleData;
  userRoleObject;
  userRole;
  testToken;
  mstrEnv;
  mstrServer;
  promptAnswersXMLSBG;
  departmentIdSBG: any = '';
  agencyIdSBG: any = '';
  officeIdSBG: any = '';
  locationConfig = {
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
  dateValidator = false;
  maxRange = '';
  currentReport = [];
  stateXML;
  countryXML;
  localEnv = false;
  PVMAXRANGE = 1.003;
  REPORTMAXRANGE = 12.003;
  userOrg = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router, private zone: NgZone, private api: IAMService, private sanitizer: DomSanitizer, private reportsService: ReportsService,
    private http: Http) {
    this.zone.runOutsideAngular(() => {
      this.checkSession(() => {
        this.zone.run(() => {
          // Callback
        });
      });
    });
    if (API_UMBRELLA_URL && (API_UMBRELLA_URL.indexOf("/prod") != -1 || API_UMBRELLA_URL.indexOf("/prodlike") != -1)) {
      this.mstrEnv = 'stg';
      this.mstrServer = 'MICROSTRATEGY-4_BI.PROD-LDE.BSP.GSA.GOV';
    } else if (API_UMBRELLA_URL && API_UMBRELLA_URL.indexOf("/minc") != -1) {
      this.mstrEnv = 'test';
      this.mstrServer = 'MICROSTRATEGY-2_BI.PROD-LDE.BSP.GSA.GOV';
    } else if (API_UMBRELLA_URL && API_UMBRELLA_URL.indexOf("/comp") != -1) {
      this.mstrEnv = 'dev';
      this.mstrServer = 'MICROSTRATEGY-3_BI.PROD-LDE.BSP.GSA.GOV';
    } else if (API_UMBRELLA_URL && API_UMBRELLA_URL.indexOf("reisys") != -1) {
      this.mstrEnv = 'dev';
      this.mstrServer = 'MICROSTRATEGY-3_BI.PROD-LDE.BSP.GSA.GOV';
      this.localEnv = true;
    }
    http.get('src/assets/report-configs/'+this.mstrEnv+'-reports.json')
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
        },
        err => console.log(err));
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.route.queryParams.subscribe(
      data => {
        this.organizationId = typeof data['organizationId'] === "string" ? decodeURI(data['organizationId']) : "";
      });
    // this.reportsService.getUserRole(Cookies.get('iPlanetDirectoryPro')).subscribe(
    //   data => {
    //     this.roleData = data;
    //     let encodedToken = this.roleData.token.split(".");
    //     this.userRoleObject = JSON.parse(base64.decode(encodedToken[1]));
    //     this.userRole = this.userRoleObject.domainMapContent[0].roleMapContent[0].role.val;
    //     if(this.userRole) {
    //       this.userOrg.push(this.userRoleObject.domainMapContent["0"].roleMapContent["0"].organizationMapContent["0"].organizations["0"]);
    //     }
    //   },
    //   error => console.log(error)
    // );
  }      

  checkSession(cb: () => void) {
    let vm = this;
    this.api.iam.user.get(function (user) {
      vm.states.isSignedIn = true;
      vm.user = user;
      if (vm.user.departmentId) {
        vm.userOrg.push(vm.user.departmentId);
      }
      cb();
    });
  }

  validate(evt) {
    var startComparison = moment(this.dateRangeModel.startDate);
    var endComparison = moment(this.dateRangeModel.endDate);
    var duration = moment.duration(endComparison.diff(startComparison));
    if (this.name == "Potential Vendor Anomaly Report") {
      if (duration.asYears() > this.PVMAXRANGE) {
        this.maxRange = "months"
        this.dateValidator = true;

      }
      else {
        if (evt == "execute") {
          this.reportExecute();
          this.dateValidator = false;
        }
        if (evt == "export") {
          this.exportReport();
          this.dateValidator = false;
        }
      }
    }
    else {
      if (duration.asYears() > this.REPORTMAXRANGE) {
        this.maxRange = "years"
        this.dateValidator = true;
      }
      else {
        if (evt == "execute") {
        this.reportExecute();
        this.dateValidator = false;
        }
        if (evt == "export") {
          this.exportReport();
          this.dateValidator = false;
        }
      }
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
    if (this.name == "Small Business Goaling Report") {
      vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl('https://microstrategy'+this.mstrEnv+'.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?Server='+this.mstrServer+'&Project=SAM_IAE&Port=8443&evt='+evt+'&src=mstrWeb.'+evt+'&currentViewMedia=1&visMode=0'+docId+'&iPlanetDirectoryPro='+Cookies.get('iPlanetDirectoryPro')+'&uid='+vm.user._id+'&role=GSA_REPORT_R_REPORT_USER&promptsAnswerXML='+this.generateXMLSBG()+"&v="+Date.now());
    } else if (this.name == "Contract Detail Report") {
      vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl('https://microstrategy'+this.mstrEnv+'.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?Server='+this.mstrServer+'&Project=SAM_IAE&Port=8443&evt='+evt+'&src=mstrWeb.'+evt+'&currentViewMedia=1&visMode=0'+docId+'&iPlanetDirectoryPro='+Cookies.get('iPlanetDirectoryPro')+'&uid='+vm.user._id+'&role=GSA_REPORT_R_REPORT_USER&promptsAnswerXML='+this.generateXMLCD()+"&v="+Date.now());
    } else {
      vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl('https://microstrategy'+this.mstrEnv+'.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?Server='+this.mstrServer+'&Project=SAM_IAE&Port=8443&evt='+evt+'&src=mstrWeb.'+evt+'&currentViewMedia=1&visMode=0'+docId+'&iPlanetDirectoryPro='+Cookies.get('iPlanetDirectoryPro')+'&uid='+vm.user._id+'&role=GSA_REPORT_R_REPORT_USER&promptsAnswerXML='+this.generateXML()+"&v="+Date.now());
    }
  }

  generateXML() {
    this.departmentId = '';
    this.agencyId = '';
    this.officeId = '';
    if (this.agencyPicker) {
      for (let i in this.agencyPicker) {
        if (this.agencyPicker[i].level == 1) {
          this.departmentId = [{type:"element",name:"at",attributes:{did:"092E3409421A8C76CCE01CB6E423BE3B",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"092E3409421A8C76CCE01CB6E423BE3B:"+this.agencyPicker[i].code,art:"1"}}];
        }
        if (this.agencyPicker[i].level == 2) {
          this.agencyId = [{type:"element",name:"at",attributes:{did:"A1FE94BE483FD8D534B145B794EC4166",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"A1FE94BE483FD8D534B145B794EC4166:"+this.agencyPicker[i].code,art:"1"}}];
        }
        if (this.agencyPicker[i].level == 3) {
          this.officeId = [{type:"element",name:"at",attributes:{did:"C556EB554CED80B514C5DFBC01CEFC5F",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"C556EB554CED80B514C5DFBC01CEFC5F:"+this.agencyPicker[i].code,art:"1"}}];;
        }
      }
    }
    let orgCodePassed = encodeURIComponent(this.orgCode);
    let contractingRegionPasssed = encodeURIComponent(this.contractingRegion);
    this.promptAnswersXML = {elements:[{type:"element",name:"rsl",elements:[{type:"element",name:"pa",attributes:{pt:"5",pin:"0",did:"08C4877C401950B7A2D182B0B36801EC",tp:"10"},elements:[{type:"text",text:this.dateRangeModel.endDate}]},{type:"element",name:"pa",attributes:{pt:"5",pin:"0",did:"343002F84DD3741D37B81198047298B1",tp:"10"},elements:[{type:"text",text:this.dateRangeModel.startDate}]},{type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"3FCC554F4FE90D3221692D93AE98EBAE",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements:this.officeId}]}]},{type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"A009A1AF453DEBD6C1A3C7A6DD3CEE00",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements:this.agencyId}]}]},{type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:"C1D7F68B4D09F29E00BE9EB436506CE6",tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements:this.departmentId}]}]},{type:"element",name:"pa",attributes:{pt:"3",pin:"0",did:"E8B36A044628ECFA1B0677899EA10FD7",tp:"10"},elements:[{type:"text",text:contractingRegionPasssed}]},{type:"element",name:"pa",attributes:{pt:"3",pin:"0",did:"36B0D8F847186CF11E92829BF216055F",tp:"10"},elements:[{type:"text",text: orgCodePassed}]}]}]}

    this.checkIncludesBases();
    this.checkIncludesAgencyName();
    this.checkIncludesStateCountry();
    return xmljs.json2xml(this.promptAnswersXML);
  }

  generateXMLSBG() {
    this.departmentIdSBG = '';
    this.agencyIdSBG = '';
    this.officeIdSBG = '';
    if (this.agencyPicker) {
      for (let i in this.agencyPicker) {
        if (this.agencyPicker[i].level == 1) {
          this.departmentIdSBG = [{type:"element",name:"at",attributes:{did:"FB2AB4B34DE1D7C3FD6BEA964061C99E",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"FB2AB4B34DE1D7C3FD6BEA964061C99E:"+this.agencyPicker[i].code,art:"1"}}];
        }
        if (this.agencyPicker[i].level == 2) {
          this.agencyIdSBG = [{type:"element",name:"at",attributes:{did:"26FAF0F343FB91A7A80566A1F7C37235",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"26FAF0F343FB91A7A80566A1F7C37235:" + this.agencyPicker[i].code,art:"1"}}];
        }
        if (this.agencyPicker[i].level == 3) {
          this.officeIdSBG = [{type:"element",name:"at",attributes:{did:"0156707745DF0346A1B8A7B0002BEBE0",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"0156707745DF0346A1B8A7B0002BEBE0:" + this.agencyPicker[i].code,art:"1"}}];
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
      let encodedStateVendor = encodeURIComponent(this.location.state.key);
      let encodedStatePoP = encodeURIComponent(this.location.state.value);
      let encodedCountryPoP = encodeURIComponent(this.location.country.value);
      let encodedCountryVendor = encodeURIComponent(this.location.country.key);
      let stateParameter = [];
      let countryParameter = [];
      let stateXMLid = '';
      let countryXMLid = '';
      // State code for geographical report by vendor location report
      if (this.id == 'B1BA646F4E0BD167A588FBBC4E9E06A8') {
        stateXMLid = 'C333A9D1438B941088B6898EEE811323';
        countryXMLid = '88E6E25643D1743D6DA8D395CE631FC2';
        if (this.location.state.value.length > 0) {
          stateParameter = [{type:"element",name:"at",attributes:{did:"EF87927B4C28EC072AD84389B81DEF63",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"EF87927B4C28EC072AD84389B81DEF63:"+encodedStateVendor.toUpperCase(),art:"1"}}];
        }
        if (this.location.country.value.length > 0) {
          countryParameter = [{type:"element",name:"at",attributes:{did:"2569E1F241BCE3414441DB81421A7B58",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"2569E1F241BCE3414441DB81421A7B58:"+encodedCountryVendor.toUpperCase(),art:"1"}}];
        }
      }
      // State code for geographical report by place of performance report
      if (this.id == 'DD333E194817ECA449A3AAA12511955F') { 
        stateXMLid = '79D5D8C241405AC36A4AAEB36CB4B62E';
        countryXMLid = 'D6D759164DCAC8BC56AAF88E3910C79A';
        if (this.location.state.value && this.location.state.value.length > 0) {
          stateParameter = [{type:"element",name:"at",attributes:{did:"E807038644FD59F5F131D8824F801A57",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"E807038644FD59F5F131D8824F801A57:"+encodedStateVendor.toUpperCase(),art:"1"}}];
        }
        if (this.location.country.value && this.location.country.value.length > 0) {
          countryParameter = [{type:"element",name:"at",attributes:{did:"07A44AB54A1A22DAA7D21C89B148CF15",tp:"12"}},{type:"element",name:"e",attributes:{emt:"1",ei:"07A44AB54A1A22DAA7D21C89B148CF15:"+encodedCountryPoP.toUpperCase(),art:"1"}}];
        }
      }
      
      this.stateXML = {type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:stateXMLid,tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements: stateParameter}]}]}
      this.promptAnswersXML.elements[0].elements.push(this.stateXML);

      this.countryXML = {type:"element",name:"pa",attributes:{pt:"7",pin:"0",did:countryXMLid,tp:"10"},elements:[{type:"element",name:"mi",elements:[{type:"element",name:"es",elements: countryParameter}]}]}
      this.promptAnswersXML.elements[0].elements.push(this.countryXML);
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
      this.dateRange.control.reset();
    }
    this.dateValidator = false;
  }

  updateCountryField(val) {
    this.location.country = val;
  }
  
  updateStateField(val) {
    this.location.state = val;
  }

  test() {
  }
}

