import { Component, Output, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { MsgFeedService } from "api-kit/msg-feed/msg-feed.service";

@Component({
  selector: 'content-management-sidenav',
  templateUrl: 'content-management-sidenav.template.html'
})
export class HelpContentManagementSideNavComponent{

  @Input() filterOption = {
    keyword:"",
    status:[],
    domains:[],
    section:"",
    subSection:"",
  };

  @Output() filterChange:EventEmitter<any> = new EventEmitter<any>();

  sidenavModel = {
    "label": "Content Management",
    "children": []
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

  constructor(private msgFeedService: MsgFeedService, private _router: Router, private route: ActivatedRoute){}

  ngOnInit(){
    this.loadFilterData();
  }

  isCurrentSection(section):boolean{return this.filterOption.section === section;}
  getCurrentTabClass(str):string{return this.isCurrentSection(str) ? 'cm-current-tab':'';}

  onSectionTabClick(sectionStr){
    // Set up current section and sub section
    let dividerIndex = sectionStr.indexOf('/');
    this.filterOption.section = sectionStr.substr(0, dividerIndex === -1? sectionStr.length:dividerIndex);
    this.filterOption.subSection = sectionStr.substr(dividerIndex === -1? sectionStr.length:dividerIndex + 1);

    this.resetFilterFields();

    // emit event for msg feed to update url
    this.contentFilterOptionChange();
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
      if(data['domainTypes']) this.loadDomains(data['domainTypes']);
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
