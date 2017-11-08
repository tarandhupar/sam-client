import { Component, Output, Input, EventEmitter } from '@angular/core';
import { IBreadcrumb, OptionsType } from "sam-ui-elements/src/ui-kit/types";
import { MsgFeedService } from "api-kit/msg-feed/msg-feed.service";
import { SystemAlertsService } from "api-kit/system-alerts/system-alerts.service";
import { IAMService } from "api-kit/iam/iam.service";
import { ActivatedRoute, Router, NavigationCancel } from '@angular/router';
import { CapitalizePipe } from "../../../app-pipes/capitalize.pipe";
import { Observable } from "rxjs";

@Component({
  selector: 'msg-feed-sidenav',
  templateUrl: 'msg-feed-sidenav.template.html'
})
export class MsgFeedSideNavComponent{

  @Output() filterChange:EventEmitter<any> = new EventEmitter<any>();

  @Input() requestTypeCountMap:any = [];
  @Input() typeIdMap: any = {};
  recievedCount = 0;

  @Input() filterOption = {
    keyword:"",
    requestType:[],
    status:[],
    alertType:[],
    alertStatus:[],
    domains:[],
    requester:[],
    approver:[],
    orgs:[],
    section:"",
    subSection:"",
  };

  requestTypeCbxConfig = {
    options: [],
    name: 'Request Type',
    label: 'Request Type',
  };

  statusCbxConfig = {
    options: [],
    name: 'Status',
    label: 'Status',
  };

  alertTypeCbxConfig = {
    options: [],
    name: 'Alert Type',
    label: 'Alert Type',
  };

  alertStatusCbxConfig = {
    options: [],
    name: 'Alert Status',
    label: 'Alert Status',
  };

  domainsCbxConfig = {
    options: [],
    name: 'Domains',
    label: 'Domains',
  };

  isSignedIn = false;

  autocompletePeoplePickerConfig = {
    keyValueConfig: {
      keyProperty: 'mail',
      valueProperty: 'givenName',
      subheadProperty: 'mail'
    }
  };

  requestTypeMap = {};

  constructor(private msgFeedService: MsgFeedService,
              private systemAlertService: SystemAlertsService,
              private _router:Router,
              private route: ActivatedRoute,
              private iamService: IAMService,
              private capitalPipe: CapitalizePipe,){}

  ngOnInit(){

    this.route.params.subscribe(param => {
      this.resetFilterFields();
      this.signInCheck();
      this.loadCounts();

    });

    this.route.queryParams.subscribe((params: any) => {
      if (params.statIds) {
        let par = params.statIds.split(',');
        this.filterOption.status = par.map(p => +p);
      }
      if (params.reqIds) {
        let par = params.reqIds.split(',');
        this.filterOption.requestType = par;
      }
    });
  }

  ngOnChanges(){
    this.loadCounts();
  }

  signInCheck(){
    this.iamService.iam.checkSession(
      (user) => {
        this.isSignedIn = true;
        this.loadFilterData();
      },
      (error) => {
        if(this.filterOption.section.toLowerCase() === 'requests'){
          this._router.navigate(['/signin'],{queryParams: { redirect: '/workspace/content-management/requests'}});
        }else{
          this.loadFilterData();
        }
      }
    );
  }

  isCurrentSection(section):boolean{return this.filterOption.section === section;}
  isCurrentPath(str):boolean{
    let pathStr = this.filterOption.section + (this.filterOption.subSection ===''? '': '/'+this.filterOption.subSection) ;
    return str === pathStr;
  }
  getCurrentTabClass(str):string{return this.isCurrentPath(str) ? 'usa-current':'';}

  onSectionTabClick(sectionStr){
    // Set up current section and sub section
    let dividerIndex = sectionStr.indexOf('/');
    this.filterOption.section = sectionStr.substr(0, dividerIndex === -1? sectionStr.length:dividerIndex);
    this.filterOption.subSection = sectionStr.substr(dividerIndex === -1? sectionStr.length:dividerIndex + 1);

    this.loadFilterData();
    this.resetFilterFields();
    this.msgFilterOptionChange();

  }

  msgFilterOptionChange(){
    // emit event for msg feed to search for current filter messages
    this.filterChange.emit(this.filterOption);
  }

  resetFilterFields(){
    this.filterOption.keyword = "";
    this.filterOption.requestType = [];
    this.filterOption.status = [];
    this.filterOption.alertType = [];
    this.filterOption.domains = [];
    this.filterOption.requester = [];
    this.filterOption.approver = [];
    this.filterOption.orgs = [];
  }

  loadFilterData(){
    let typeStr = this.filterOption.subSection === ""? this.filterOption.section: this.filterOption.subSection;
    this.msgFeedService.getFilters(this.typeIdMap[typeStr]).subscribe(data =>{
      this.loadRequestsTypeMap(data.requestTypes);
      this.loadRequestStatus(data.requestStatus);
      this.loadAlertType(data.alertTypes);
      this.loadAlertStatus(data.alertStatus);
      this.loadDomains(data.domainTypes);
    });
  }

  loadAlertType(alertTypes){
    this.alertTypeCbxConfig.options = [];
    if(alertTypes){
      alertTypes.forEach(type => {this.alertTypeCbxConfig.options.push({value: type, label: type, name: type});});
    }
  }

  loadAlertStatus(alertStatus){
    this.alertStatusCbxConfig.options = [];
    if(alertStatus){
      alertStatus.forEach(status => {this.alertStatusCbxConfig.options.push({value: status, label: status, name: status});});
    }
  }

  loadRequestsTypeMap(requestTypes){
    if(requestTypes){
      requestTypes.forEach(type => {
        this.requestTypeMap[type.requestTypeId] = type.requestTypeNames;
      });
    }
  }

  loadRequestStatus(requestStatus){
    this.statusCbxConfig.options = [];
    if(requestStatus){
      requestStatus.forEach(status => {
        this.statusCbxConfig.options.push({value: status.requestStatusId, label: status.requestStatus, name: status.requestStatus});
      });
    }
  }

  loadDomains(domainTypes){
    this.domainsCbxConfig.options = [];
    if(domainTypes){
      domainTypes.forEach(domain => {
        if(domain.isActive)
          this.domainsCbxConfig.options.push({value: domain.id, label: domain.domainName, name: domain.domainName});
      });
    }
  }

  loadCounts(){
    this.requestTypeCbxConfig.options = [];
    if(this.requestTypeCountMap.totalCount) this.recievedCount = this.requestTypeCountMap.totalCount;
    Object.keys(this.requestTypeCountMap).forEach(key => {
      if(key !== 'totalCount'){
        this.requestTypeCbxConfig.options.push({value:key, label:this.requestTypeMap[key], name:this.requestTypeMap[key], count:this.requestTypeCountMap[key]});
      }
    });
  }

  hasActiveItem(option):boolean{
    return option.count && option.count > 0;
  }

  getSearchText(){
    let searchText = "";
    if(this.filterOption.section.toLowerCase() === 'notifications'){
      searchText = this.filterOption.subSection === ''? this.filterOption.section: this.filterOption.subSection;
    }else{
      searchText = "requests";
    }
    return this.capitalPipe.transform(searchText);
  }

  resetFilter(){
    this.resetFilterFields();
    this.filterChange.emit(this.filterOption);
  }

}
