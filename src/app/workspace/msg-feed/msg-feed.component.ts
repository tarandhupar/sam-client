import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBreadcrumb, OptionsType } from "sam-ui-kit/types";
import { MsgFeedService } from "api-kit/msg-feed/msg-feed.service";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";

@Component({
  templateUrl: './msg-feed.template.html',
})
export class MsgFeedComponent {

  private crumbs: Array<IBreadcrumb> = [
    { url: '/workspace', breadcrumb: 'Workspace' },
    { breadcrumb: '' }
  ];

  recordsPerPage = 10;

  curSection:string = "";
  curSubSection:string = "";

  validSections = ['requests','notifications'];
  validSubSections = {'requests':['received','sent'],'notifications':['subscriptions','announcements','alerts']}

  sortByModel = 'Date';
  msgSortOptions = [{label:'Date', name:'Date', Value:'Date'}];

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

  constructor(private route:ActivatedRoute, private _router:Router, private msgFeedService:MsgFeedService, private capitalPipe: CapitalizePipe){}

  ngOnInit(){
    this.route.params.subscribe(
      params => {
        if(!this.validateUrlParams(params)) this._router.navigateByUrl('/404');
        this.curSection = params['section'];
        this.curSubSection = params['subsection']? params['subsection']:'';
        this.crumbs[1].breadcrumb = this.capitalPipe.transform(this.curSection);
        this.filterObj.section = this.curSection;
        this.filterObj.subSection = this.curSubSection;
        this.loadFeeds(this.filterObj, this.sortByModel, this.orderByOptions[this.orderByIndex], this.curPage);
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
    this.loadFeeds(this.filterObj, this.sortByModel, this.orderByOptions[this.orderByIndex], this.curPage);
  }

  /* update message feeds based on sortBy field changes*/
  onSortSelectModelChange(){}

  /* update message feeds based on page num changes*/
  onPageNumChange(pageNum){
    this.curPage = pageNum;
    this.loadFeeds(this.filterObj, this.sortByModel, this.orderByOptions[this.orderByIndex], this.curPage);
  }

  /* update message feeds based on orderBy obj changes*/
  onOrderByChange(){
    this.orderByIndex = 1 - this.orderByIndex;
    this.curPage = 0;
    //this.loadFeeds()
  }

  /* search message feeds with filter, sortby, page number and order*/
  loadFeeds(filterObj, sortBy, order, page){
    this.msgFeedService.getFeeds(filterObj, sortBy, order, page, this.recordsPerPage).subscribe(data => {
      this.msgFeeds = data['feeds'];
      this.totalRecords = data['totalCount'];
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
}
