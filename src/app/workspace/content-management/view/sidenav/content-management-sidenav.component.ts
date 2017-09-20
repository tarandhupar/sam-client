import { Component, Output, Input, EventEmitter } from '@angular/core';
import { IBreadcrumb, OptionsType } from "sam-ui-kit/types";
import { MsgFeedService } from "api-kit/msg-feed/msg-feed.service";

@Component({
  selector: 'content-management-sidenav',
  templateUrl: 'content-management-sidenav.template.html'
})
export class HelpContentManagementSideNavComponent{

  @Input() curSection: string = "";
  @Input() curSubSection: string = "";

  @Output() filterChange:EventEmitter<any> = new EventEmitter<any>();

  sidenavModel = {
    "label": "Content Management",
    "children": []
  };

  filterOption = {
    keyword:"",
    status:[],
    domains:[],
    section:"",
    subSection:"",
  };

  statusCbxConfig = {
    options: [
      {value: 'Published', label: 'Published', name: 'Published'},
      {value: 'Draft', label: 'Draft', name: 'Draft'},
      {value: 'Archived', label: 'Archived', name: 'Archived'},
      {value: 'New', label: 'New', name: 'New'},
    ],
    name: 'Status',
    label: 'Status',
  };

  domainsCbxConfig = {
    options: [],
    name: 'Domains',
    label: 'Domains',
  };

  constructor(private msgFeedService: MsgFeedService){}

  ngOnInit(){
    this.loadFilterData();
  }

  isCurrentSection(section):boolean{return this.curSection === section;}
  isCurrentPath(str):boolean{
    let pathStr = this.curSection + (this.curSubSection ===''? '': '/'+this.curSubSection) ;
    return str === pathStr;
  }
  getCurrentTabClass(str):string{return this.isCurrentPath(str) ? 'cm-current-tab':'';}

  onSectionTabClick(sectionStr){
    // Set up current section and sub section
    let dividerIndex = sectionStr.indexOf('/');
    this.curSection = sectionStr.substr(0, dividerIndex === -1? sectionStr.length:dividerIndex);
    this.curSubSection = sectionStr.substr(dividerIndex === -1? sectionStr.length:dividerIndex + 1);
    this.filterOption.section = this.curSection;
    this.filterOption.subSection = this.curSubSection;

    this.resetFilterFields();
    this.contentFilterOptionChange();

    // May want to update counts for requests again

    // emit event for msg feed to update url
  }

  contentFilterOptionChange(){

    // emit event for msg feed to search for current filter messages
    this.filterChange.emit(this.filterOption);
  }

  resetFilterFields(){
    this.filterOption.keyword = "";
    this.filterOption.status = [];
    this.filterOption.domains = [];
  }

  loadFilterData(){
    this.msgFeedService.getFilters('3').subscribe(data =>{
      this.loadDomains(data.domainTypes);
    });
  }

  loadDomains(domainTypes){
    this.domainsCbxConfig.options = [];
    if(domainTypes){
      domainTypes.forEach(domain => {
        if(domain.isActive)
          this.domainsCbxConfig.options.push({value: domain.id, label: domain.domainName, name: domain.domainName});
      });
      this.domainsCbxConfig.options.push({value: 'other', label: 'Other Domain', name: 'Other Domain'});
    }
  }

  resetFilter(){
    this.resetFilterFields();
    this.filterChange.emit(this.filterOption);
  }
}
