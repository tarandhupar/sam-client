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

  @Input() typeIdMap: any = {};
  @Input() roleCount = 0;
  @Input() titleChangeCount = 0;
  @Input() numberChangeCount = 0;
  @Input() recievedCount = 0;

  filterOption = {
    keyword:"",
    requestType:[],
    status:[],
    alertType:[],
    domains:[],
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

  domainsCbxConfig = {
    options: [],
    name: 'Domains',
    label: 'Domains',
  };

  constructor(private msgFeedService: MsgFeedService, private systemAlertService: SystemAlertsService){}

  ngOnInit(){
    this.loadFilterData();
  }

  ngOnChanges(){

    this.loadCounts();
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

    this.loadFilterData();
    this.resetFilterFields();
    this.msgFilterOptionChange();

    // May want to update counts for requests again

    // emit event for msg feed to update url
  }

  msgFilterOptionChange(){
    this.filterOption.section = this.curSection;
    this.filterOption.subSection = this.curSubSection;
    // emit event for msg feed to search for current filter messages
    this.filterChange.emit(this.filterOption);
  }

  resetFilterFields(){
    this.filterOption.keyword = "";
    this.filterOption.requestType = [];
    this.filterOption.status = [];
    this.filterOption.alertType = [];
    this.filterOption.domains = [];
  }

  loadFilterData(){
    let typeStr = this.curSubSection === ""? this.curSection: this.curSubSection;
    this.msgFeedService.getFilters(this.typeIdMap[typeStr]).subscribe(data =>{
      this.loadRequestsTypeAndCount(data.requestTypes);
      this.loadRequestStatus(data.requestStatus);
      this.loadAlertType(data.alertTypes);
      this.loadDomains(data.domainTypes);

    });
  }

  loadAlertType(alertTypes){
    this.alertTypeCbxConfig.options = [];
    if(alertTypes){
      alertTypes.forEach(type => {this.alertTypeCbxConfig.options.push({value: type, label: type, name: type});});
    }
  }

  loadRequestsTypeAndCount(requestTypes){
    this.requestTypeCbxConfig.options = [];
    if(requestTypes){
      requestTypes.forEach(type => {
        this.requestTypeCbxConfig.options.push({value: type.requestTypeId, label: type.requestTypeNames, name: type.requestTypeNames, count:0});
      });
      this.loadCounts();
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
    this.requestTypeCbxConfig.options.forEach(e =>{
      if(e.label.includes('Role'))e.count = this.roleCount;
      if(e.label.includes('Title'))e.count = this.titleChangeCount;
      if(e.label.includes('Number'))e.count = this.numberChangeCount;
    });
  }

  hasActiveItem(option):boolean{
    return option.count && option.count > 0;
  }
}
