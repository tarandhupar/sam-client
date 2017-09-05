import { Component, Output, Input, EventEmitter } from '@angular/core';
import { IBreadcrumb, OptionsType } from "sam-ui-kit/types";
import { MsgFeedService } from "api-kit/msg-feed/msg-feed.service";
import { SystemAlertsService } from "api-kit/system-alerts/system-alerts.service";

@Component({
  selector: 'msg-feed-sidenav',
  templateUrl: 'msg-feed-sidenav.template.html'
})
export class MsgFeedSideNavComponent{

  @Input() curSection: string = "";
  @Input() curSubSection: string = "";

  @Output() filterChange:EventEmitter<any> = new EventEmitter<any>();

  filterOption = {
    keyword:"",
    requestType:[],
    status:[],
    alertType:[],
    domains:[],
    section:"",
    subSection:"",
  };

  cbxControl = {
    requestType: true,
    status: true,
    alertType: true,
    domains: true,
  };

  requestTotalCount = 10;
  requestSentTotalCount = 6;
  requestReceivedTotalCount = 4;
  requestTypeCbxConfig = {
    options: [],
    name: 'Request Type',
    label: 'Request Type',
  };

  statusCbxConfig = {
    options: [
      {value: 'Pending', label: 'Pending', name: 'Pending'},
      {value: 'Approved', label: 'Approved', name: 'Approved'},
      {value: 'Rejected', label: 'Rejected', name: 'Rejected'},
    ],
    name: 'Status',
    label: 'Status',
  };

  alertTypeCbxConfig = {
    options: [],
    name: 'Alert Type',
    label: 'Alert Type',
  };

  domainsCbxConfig = {
    options: [],
    name: 'Domains',
    label: 'Domains',
  };

  constructor(private msgFeedService: MsgFeedService, private systemAlertService: SystemAlertsService){}

  ngOnInit(){
    this.setCbxControl();
    this.loadFilterData();
  }

  isCurrentSection(section):boolean{return this.curSection === section;}
  isCurrentPath(str):boolean{
    let pathStr = this.curSection + (this.curSubSection ===''? '': '/'+this.curSubSection) ;
    return str === pathStr;
  }
  getCurrentTabClass(str):string{return this.isCurrentPath(str) ? 'usa-current':'';}

  onSectionTabClick(sectionStr){
    // Set up current section and sub section
    let dividerIndex = sectionStr.indexOf('/');
    this.curSection = sectionStr.substr(0, dividerIndex === -1? sectionStr.length:dividerIndex);
    this.curSubSection = sectionStr.substr(dividerIndex === -1? sectionStr.length:dividerIndex + 1);
    this.filterOption.section = this.curSection;
    this.filterOption.subSection = this.curSubSection;

    this.setCbxControl();
    this.resetFilterFields();
    this.msgFilterOptionChange();

    // May want to update counts for requests again

    // emit event for msg feed to update url
  }

  msgFilterOptionChange(){

    // emit event for msg feed to search for current filter messages
    this.filterChange.emit(this.filterOption);
  }

  /* Set up proper checkbox to show on each section or subsection*/
  setCbxControl(){
    Object.keys(this.cbxControl).forEach( key => {this.cbxControl[key] = true;});
    if(this.curSection !== 'requests') {
      this.cbxControl.requestType = false;
      this.cbxControl.status = false;
    }

    if(this.curSubSection !== 'subscriptions') this.cbxControl.domains = false;
    if(this.curSubSection !== 'alerts') this.cbxControl.alertType = false;
    if(this.curSection === 'notifications' && this.curSubSection === '') {
      this.cbxControl.domains = true;
      this.cbxControl.alertType = true;
    }
  }

  resetFilterFields(){
    this.filterOption.keyword = "";
    this.filterOption.requestType = [];
    this.filterOption.status = [];
    this.filterOption.alertType = [];
    this.filterOption.domains = [];
  }

  getRequestTypeCount(option){
    if(this.isCurrentPath('requests/sent')){
      return option.sentCount;
    }else if(this.isCurrentPath('requests/received')){
      return option.receivedCount;
    }
    return option.sentCount + option.receivedCount;
  }

  loadFilterData(){
    this.loadAlertType();
    this.loadRequestsTypeAndCount();
    this.loadDomains();
  }

  loadAlertType(){
    this.systemAlertService.getAlertTypes().subscribe(res => {
      this.alertTypeCbxConfig.options = [];
      res.forEach(type => {this.alertTypeCbxConfig.options.push({value: type, label: type, name: type});});
    });
  }

  loadRequestsTypeAndCount(){
    this.msgFeedService.getRequestsType().subscribe(res => {
      this.requestTypeCbxConfig.options = [];
      res.RequestsType.forEach(type => {this.requestTypeCbxConfig.options.push({value: type, label: type, name: type, sentCount:res[type]['sentCount'], receivedCount:res[type]['receivedCount'],});});
      this.requestReceivedTotalCount = res.totalCount['receivedCount'];
      this.requestSentTotalCount = res.totalCount['sentCount'];
      this.requestTotalCount = this.requestReceivedTotalCount + this.requestSentTotalCount;
    });

  }

  loadDomains(){
    this.msgFeedService.getDomains().subscribe(res => {
      this.domainsCbxConfig.options = [];
      res.Domains.forEach(domain => {this.domainsCbxConfig.options.push({value: domain, label: domain, name: domain});});
    });
  }
}
