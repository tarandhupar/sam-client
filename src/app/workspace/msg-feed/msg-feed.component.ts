import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBreadcrumb, OptionsType } from "sam-ui-kit/types";
import { MsgFeedService } from "api-kit/msg-feed/msg-feed.service";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  templateUrl: './msg-feed.template.html',
})
export class MsgFeedComponent {

  private crumbs: Array<IBreadcrumb> = [
    { url: '/workspace', breadcrumb: 'Workspace' },
    { breadcrumb: '' }
  ];

  typeIdMap: any = {
    'requests': '1,2',
    'notifications': '3,4,5',
    'sent': '1',
    'received': '2',
    'subscriptions': '3',
    'announcements': '4',
    'alerts': '5',
  };

  recordsPerPage = 10;

  curSection:string = "";
  curSubSection:string = "";

  validSections = ['requests','notifications'];
  validSubSections = {'requests':['received','sent'],'notifications':['subscriptions','announcements','alerts']}

  sortByModel = {type: 'reqDate', sort: 'asc' };
  msgSortOptions = [
    {label:'Request Date', name:'Date', value:'reqDate'},
    {label:'Respond Date', name:'Date', value:'respDate'},
  ];

  orderByIndex = 0;
  orderByOptions = ["asc","desc"];

  //current results num data variables
  curStart = 0;
  curEnd = 0;
  totalRecords = 0;

  //pagination variables
  curPage = 0;
  totalPages = 10;

  filterObj = {
    keyword:"",
    requestType:[],
    status:[],
    alertType:[],
    domains:[],
    section:"",
    subSection:"",
  };
  msgFeeds = [];

  roleCount;
  titleChangeCount;
  numberChangeCount;
  recievedCount;

  constructor(private route:ActivatedRoute, private _router:Router, private msgFeedService:MsgFeedService, private capitalPipe: CapitalizePipe, private _sanitizer: DomSanitizer){}

  ngOnInit(){
    this.route.params.subscribe(
      params => {
        if(!this.validateUrlParams(params)) this._router.navigateByUrl('/404');
        this.curSection = params['section'];
        this.curSubSection = params['subsection']? params['subsection']:'';
        this.crumbs[1].breadcrumb = this.capitalPipe.transform(this.curSection);
        this.filterObj.section = this.curSection;
        this.filterObj.subSection = this.curSubSection;
        this.loadFeeds(this.getTypeIdStr(this.filterObj), this.filterObj, this.sortByModel, this.curPage+1);
      });
  }

  validateUrlParams(params):boolean{
    if(params['section']){
      if(this.validSections.indexOf(params['section']) === -1) return false;
      if(params['subsection']){
        if(this.validSubSections[params['section']].indexOf(params['subsection']) === -1) return false;
      }
      return true;
    }
    return true;
  }

  /* update message feeds based on filter obj changes*/
  onFilterChange(filterObj){
    this.filterObj = filterObj;
    this.curPage = 0;
    this.loadFeeds(this.getTypeIdStr(filterObj), this.filterObj, this.sortByModel, this.curPage+1);
  }

  /* update message feeds based on sortBy field changes*/
  onSortSelectModelChange(event){
    this.curPage = 0;
    this.loadFeeds(this.getTypeIdStr(this.filterObj), this.filterObj, event, this.curPage+1);
  }

  /* update message feeds based on page num changes*/
  onPageNumChange(pageNum){
    this.curPage = pageNum;
    this.loadFeeds(this.getTypeIdStr(this.filterObj), this.filterObj, this.sortByModel, this.curPage+1);
  }

  /* search message feeds with filter, sortby, page number*/
  loadFeeds(typeId, filterObj, sortBy, page){

    this.msgFeedService.getFeeds(typeId, filterObj, sortBy, page, this.recordsPerPage).subscribe(data => {

      if(filterObj.section === "requests"){
        this.msgFeeds = data['requestFeeds'];
        this.totalRecords = data['totalRecords'];
        this.recievedCount = data['recievedCount'];
        this.roleCount = data['roleCount'];
        this.numberChangeCount = data['numberChangeCount'];
        this.titleChangeCount = data['titleChangeCount'];
      } else if(filterObj.section === 'notifications'){
        this.msgFeeds = data['notificationFeeds'];
        this.totalRecords = data['notificationCount'];
      }

      this.totalPages = Math.ceil(this.totalRecords/this.recordsPerPage);

      this.updateRecordsText();
    });
  }


  updateRecordsText(){
    this.curStart = this.curPage * this.recordsPerPage + 1;
    this.curEnd = (this.curPage + 1) * this.recordsPerPage;
    if( this.curEnd >= this.totalRecords) this.curEnd = this.totalRecords;
    if( this.totalRecords === 0) this.curStart = 0;
  }

  /* Get css classes*/
  getOrderByClass(){return "fa-sort-amount-" + this.orderByOptions[this.orderByIndex];}
  getAlertFeedClass(feed){return "usa-alert-" + feed.alertType.toLowerCase();}

  getTypeIdStr(filterObj):string{
    let filterTypeStr = filterObj.subSection === ""? filterObj.section: filterObj.subSection;
    return this.typeIdMap[filterTypeStr];
  }

}
