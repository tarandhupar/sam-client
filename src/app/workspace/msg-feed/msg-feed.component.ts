import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBreadcrumb, OptionsType } from "sam-ui-elements/src/ui-kit/types";
import { MsgFeedService } from "api-kit/msg-feed/msg-feed.service";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from 'moment';

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

  noFeedsInfo = "Loading Feeds";

  curSection:string = "";
  curSubSection:string = "";
  title:string = "";

  validSections = ['requests','notifications'];
  validSubSections = {'requests':['received','sent'],'notifications':['subscriptions','announcements','alerts']};

  sortByModel = {};
  msgSortOptions = [];

  sortOptionsMap = {
    'requests': [
      {label:'Request Date', name:'Date', value:'reqDate'},
      {label:'Response Date', name:'Date', value:'respDate'},
    ],
    'notifications': [{label:'Received Date', name:'Date', value:'recDate'}],
  };

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
    alertStatus:[],
    domains:[],
    requester:[],
    approver:[],
    orgs:[],
    section:"",
    subSection:"",
  };
  msgFeeds = [];

  requestTypeMap:any = {};


  constructor(private route:ActivatedRoute, private _router:Router, private msgFeedService:MsgFeedService, private capitalPipe: CapitalizePipe, private _sanitizer: DomSanitizer){}

  ngOnInit(){
    this.route.params.subscribe(
      params => {
        if(!this.validateUrlParams(params)) this._router.navigateByUrl('/404');
        this.noFeedsInfo = "Loading Feeds";
        this.curSection = params['section'];
        this.curSubSection = params['subsection']? params['subsection']:'';
        this.crumbs[1].breadcrumb = this.capitalPipe.transform(this.curSection);
        this.msgSortOptions = this.sortOptionsMap[this.curSection.toLowerCase()];
        this.sortByModel = {type: this.msgSortOptions[0].value, sort: 'asc' };
        this.filterObj.section = this.curSection;
        this.filterObj.subSection = this.curSubSection;
        this.setTitle(this.curSection, this.curSubSection);
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
    this.updateSection(this.filterObj);
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

  /* Link to correct page by clicking on the feed item*/
  onFeedItemClick(feed){
    if(feed['link'])this._router.navigateByUrl(feed['link']);
  }

  /* search message feeds with filter, sortby, page number*/
  loadFeeds(typeId, filterObj, sortBy, page){
    this.msgFeeds = [];
    this.noFeedsInfo = "Loading Feeds";
    this.msgFeedService.getFeeds(typeId, filterObj, sortBy, page, this.recordsPerPage).subscribe(
      data => {
        if(filterObj.section === "requests"){
          this.msgFeeds = data['requestFeeds'];
          this.totalRecords = data['totalRecords'];
          this.requestTypeMap = data['requestTypeMap'];

        } else if(filterObj.section === 'notifications'){
          this.msgFeeds = data['notificationFeeds'];
          this.totalRecords = data['notificationCount'];
        }

        if(this.msgFeeds.length === 0) this.noFeedsInfo = "No Message Feeds";
        this.totalPages = Math.ceil(this.totalRecords/this.recordsPerPage);

        this.updateRecordsText();
      },
      error=> {
        this.noFeedsInfo = "No Message Feeds";
        console.log(error);
      });

  }


  updateRecordsText(){
    this.curStart = this.curPage * this.recordsPerPage + 1;
    this.curEnd = (this.curPage + 1) * this.recordsPerPage;
    if( this.curEnd >= this.totalRecords) this.curEnd = this.totalRecords;
    if( this.totalRecords === 0) this.curStart = 0;
  }

  updateSection(filterObj){
    this.curSection = filterObj.section;
    this.curSubSection = filterObj.subSection;
    this.setTitle(this.curSection, this.curSubSection);
  }

  /* Get css classes*/
  getOrderByClass(){return "fa-sort-amount-" + this.orderByOptions[this.orderByIndex];}
  getAlertFeedClass(feed){
    if(feed.alertTypeName.toLowerCase().includes('information')){
      return 'usa-alert-info';
    }
    return "usa-alert-" + feed.alertTypeName.toLowerCase();
  }

  getTypeIdStr(filterObj):string{
    let filterTypeStr = filterObj.subSection === ""? filterObj.section: filterObj.subSection;
    return this.typeIdMap[filterTypeStr];
  }

  setTitle(section, subsection){
    this.title = "";
    if(section.toLowerCase() === 'requests'){
      this.title = subsection === ''? section: subsection + " " + section;
    }else{
      this.title = subsection === ''? section: subsection;
    }
  }

  transformDateStr(dateStr):string{
    let date = moment(dateStr).format('MMM DD YYYY hh:mmA');
    let now = moment().format('YYYY-MM-DD');
    if(moment(dateStr).isSame(now,'year')){
      if(moment(dateStr).isSame(now,'month') && moment(dateStr).isSame(now,'day')){
        return moment(dateStr).format('hh:mmA');
      }
      return moment(dateStr).format('MMM DD hh:mmA');
    }
    return date;
  }
}
