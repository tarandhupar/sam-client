import { Component, Output, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { MsgFeedService } from "api-kit/msg-feed/msg-feed.service";
import { Cookie } from "ng2-cookies";

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
      {value: '1', label: 'New', name: 'New'},
      {value: '2', label: 'Published', name: 'Published'},
      {value: '3', label: 'Draft', name: 'Draft'},
      {value: '4', label: 'Archived', name: 'Archived'},
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
    this.msgFeedService.getDomains().subscribe(data =>{
      try{
        this.loadDomains(data);
      }catch (error){
        console.log(error);
      }
    });
  }

  loadDomains(domainTypes){
    this.domainsCbxConfig.options = [];
    if(domainTypes){
      Object.keys(domainTypes).forEach(key => {
        this.domainsCbxConfig.options.push({value: key, label: domainTypes[key], name: domainTypes[key]});
      });
      this.domainsCbxConfig.options.push({value: 0, label: 'Other Domain', name: 'Other Domain'});
    }
  }

  resetFilter(){
    this.resetFilterFields();
    this.filterChange.emit(this.filterOption);
  }
}
