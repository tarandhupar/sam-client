import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import * as Cookies from 'js-cookie';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";
import { IBreadcrumb } from "sam-ui-kit/types";
import {AlertFooterService} from "../../app-components/alert-footer/alert-footer.service";
import {OpportunityService} from "../../../api-kit/opportunity/opportunity.service";
import {DictionaryService} from "../../../api-kit/dictionary/dictionary.service";
import {FHService} from "../../../api-kit/fh/fh.service";

@Component({
  moduleId: __filename,
  templateUrl: 'opportunity-workspace.template.html',
  providers: []
})

export class OPPWorkspacePage implements OnInit, OnDestroy {

  @ViewChild('autocomplete') autocomplete: any;

  keyword: string = '';
  organizationId: string = '';
  pageNum = 0;
  totalCount: any = 0;
  totalPages: any = 0;
  data = [];
  initLoad = true;
  qParams: any = {};
  size: any = {};
  oldKeyword: string = "";
  cookieValue: string;
  runOppSub: any;
  orgMap: any = new Map();
  noticeTypeMap = new Map();
  public permissions: any;
  private showOpp: boolean = false;
  keywordsModel: any = [];
  keywordsConfiguration = {
    placeholder: "Keyword Search",
    selectedLabel: "Keywords",
    allowAny: true,
    keyValueConfig: {
      keyProperty: 'value',
      valueProperty: 'label'
    },
    dropdownLimit: 10
  };
  workspaceSearchConfig: any = {
    placeholder: "Search Workspace"
  };
  serviceErrorFooterAlertModel = {
    title: "Error",
    description: "",
    type: "error"
  };
  crumbs: Array<IBreadcrumb> = [
    { breadcrumb:'Home', url:'/',},
    { breadcrumb: 'Workspace', url: '/workspace' },
    { breadcrumb: 'Contract Opportunities'}
  ];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private opportunityService: OpportunityService, private fhService: FHService, private dictionaryService: DictionaryService, private alertFooterService: AlertFooterService) {
  }

  ngOnInit() {
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');
    this.activatedRoute.queryParams.subscribe(
      data => {
        this.pageNum = typeof data['page'] === "string" && parseInt(data['page']) - 1 >= 0 ? parseInt(data['page']) - 1 : 0;
        this.keywordsModel = data['keywords'] ? this.keywordRebuilder(data['keywords']) : [];
        this.runOpportunity();
      });
  }

  ngOnDestroy() {
    if (this.runOppSub)
      this.runOppSub.unsubscribe();
  }

  // builds object we set into url to persist data
  setupQS() {
    let qsobj = {};
    if(this.keywordsModel.length > 0){
      qsobj['keywords'] = this.keywordSplitter(this.keywordsModel);
    } else {
      this.keywordsModel = [];
    }
    if (this.pageNum >= 0) {
      qsobj['page'] = this.pageNum + 1;
    } else {
      qsobj['page'] = 1;
    }

    return qsobj;
  }

  runOpportunity() {

    // make api call
    this.runOppSub = this.opportunityService.runOpportunity({
      keyword: this.keywordSplitter(this.keywordsModel),
      pageNum: this.pageNum,
      Cookie: this.cookieValue,
    }).subscribe(
      data => {
        if (data._embedded && data._embedded.opportunity) {
          this.data = data._embedded.opportunity;
          this.totalCount = data.page['totalElements'];
          this.size = data.page['size'];
          this.totalPages = data.page['totalPages'];
          this.createNoticeTypeMap();
          this.createOrgNameMap();
        } else {
          this.totalCount = 0;
          this.data = [];
        }
        this.oldKeyword = this.keyword;
        this.initLoad = false;
        this.showOpp = true;
      },
      error => {
        console.error('Error!!', error);
        let errorRes = error.json();
        if (error && error.status === 404) {
          this.router.navigate(['404']);
        } else if (error && (error.status === 502 || error.status === 504)) {
          this.serviceErrorFooterAlertModel.description = errorRes.message;
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.serviceErrorFooterAlertModel)));
        }
      }
    );
    // construct qParams to pass parameters to object view pages
    this.qParams['keyword'] = this.keyword;
  }

  pageChange(pagenumber) {
    this.pageNum = pagenumber;
    this.workspaceRefresh();
  }

  workspaceSearchModel(event) {
    if(event == null) {
      this.autocomplete.inputValue = "";
      this.keyword = "";
    } else {
      this.keyword = event;
    }
  }

  workspaceSearchClick() {
    this.pageNum = 0;
    // build a new keywords model with keyword
    this.keywordsModel = this.keywordRebuilder(this.keyword);
    this.workspaceRefresh();
    this.keyword = '';
    this.autocomplete.inputValue = '';
  }

  keywordRebuilder(keywordStringOrArray){

    // if passed value is string
    if(typeof(keywordStringOrArray) === "string"){
      // use split to convert string to array
      var tempArray = keywordStringOrArray.split(",");
      // use map to loop through all items and build objects
      return tempArray.map(function(item){
        var tempObj = {label:"", value:""};
        tempObj.label = item;
        tempObj.value = item;
        return tempObj;
      });
    }

    // if passed value is array
    else if(Array.isArray(keywordStringOrArray)){
      // use map to loop through all items and build objects
      return keywordStringOrArray.map(function(item){
        var tempObj = {label:"", value:""};
        tempObj.label = item;
        tempObj.value = item;
        return tempObj;
      });
    }
  }

  keywordSplitter(keywordArray){
    var newString = "";

    if(keywordArray && keywordArray !== ""){
      // use reduce to separate items into string: item1 + " " + item2 etc
      newString = keywordArray.reduce(function(accumulator, currentVal){
        if(accumulator === ""){
          return currentVal.value;
        }

        return accumulator + "," + currentVal.value;
      }, "");
    }

    return newString;
  }

  keywordsModelChange(value){
    if(value.length === 1){
      this.keywordsModel = value;
    }
    // TODO: replace this code that removes additonal keywords from filter whenever tier 2 switches to searches against multiple keywords
    else if(value.length > 1){
      var tempArray = [];
      tempArray.push(value[value.length - 1]);
      this.keywordsModel = tempArray;
    }
    else{
      this.keywordsModel = [];
    }

    // refresh results
    this.pageNum = 0;
    this.workspaceRefresh();
  }

  createOrgNameMap(){
    let idArray = new Set(this.data.map(data => {
      let id = data.data.organizationId;

      if(typeof id !== 'string'){
        return id.toString();
      }
      return id;
    }));
    let uniqueIdList = Array.from(idArray).join();
    let ctx = this;
    if(uniqueIdList && uniqueIdList.length > 0){
      this.fhService.getOrganizationsByIds(uniqueIdList)
        .subscribe(
          data => {
            data._embedded.orgs.forEach(function(org){
              ctx.orgMap.set(org.org.orgKey.toString(), org.org.name);
            });
            this.addNameToData("office");
          },
          error => {
            console.error('Error!!', error);
          }
        );
    }
  }

  createNoticeTypeMap(){
    let ctx = this;
      this.dictionaryService.getOpportunityDictionary('procurement_type')
        .subscribe(
          data => {
            data['procurement_type'].forEach(function(type){
              ctx.noticeTypeMap.set(type.code, type.value);
            });
            this.addNameToData("notice");
          },
          error => {
            console.error('Error!!', error);
          }
        );
  }

  addNameToData(name: string) {
    let ctx = this;
    ctx.data.forEach(function(data){
      switch(name) {
        case "office": data['officeName'] = ctx.orgMap.get(data.data.organizationId.toString());
          break;
        case "notice": data['noticeType'] = ctx.noticeTypeMap.get(data.data.type.toString());
          break;
      }
    });
  }


  workspaceRefresh(){
    let qsobj = this.setupQS();
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/opp/workspace/'], navigationExtras);
  }

}
