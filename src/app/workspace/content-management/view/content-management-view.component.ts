import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { IBreadcrumb, OptionsType } from "sam-ui-elements/src/ui-kit/types";
import { ContentManagementService } from "api-kit/content-management/content-management.service";
import { FeatureToggleService } from "api-kit/feature-toggle/feature-toggle.service";
import { MsgFeedService } from "api-kit/msg-feed/msg-feed.service";
import { CapitalizePipe } from "../../../app-pipes/capitalize.pipe";
import { Observable } from 'rxjs';
import { AlertFooterService } from "../../../app-components/alert-footer/alert-footer.service";
import { CMSMapping } from "../content-management-mapping";
import * as moment  from "moment";

@Component({
  templateUrl: './content-management-view.template.html',
})
export class HelpContentManagementViewComponent {

  private crumbs: Array<IBreadcrumb> = [
    { url: '/workspace', breadcrumb: 'Workspace' },
    { breadcrumb: '' }
  ];

  private actions = [
    {icon:"fa fa-pencil", label:"Edit", name:"Edit", callback: ()=>{}},
    {icon:"fa fa-times", label:"Delete", name:"Delete", callback: ()=>{}},
  ];

  recordsPerPage = 5;

  toggleBtn:boolean = false;

  title:string = "";
  curSection:string = "";
  curSubSection:string = "";

  validSections = ['data-dictionary','video-library', 'FAQ-repository'];

  sortByModel = {
    'FAQ-repository': {type: 'latest update', sort: 'asc' },
    'data-dictionary': {type: 'alphabetical', sort: 'asc' },
    'video-library': {type: 'alphabetical', sort: 'asc' },
  };

  sortOptionsMap = {
    'FAQ-repository': [{label:'Latest Update', name:'Latest Update', value:'lastmodifieddate'}],
    'data-dictionary': [{label:'Alphabetical', name:'Alphabetical', value:'title'}],
    'video-library': [{label:'Alphabetical', name:'Alphabetical', value:'title'}],
  };

  //current results num data variables
  curStart = 0;
  curEnd = 0;
  totalRecords = 0;

  //pagination variables
  curPage = 0;
  totalPages = 10;

  filterObj = {
    keyword:"",
    status:[],
    domains:[],
    section:"",
    subSection:"",
  };

  contents = [];
  noContentsInfo = 'Loading';
  createTextMap = {
    'data-dictionary': "New Definition",
    'FAQ-repository': "New Question",
    'video-library': "New Video",
  };

  cmsMapping = new CMSMapping();
  domainsMapping;

  constructor(private route:ActivatedRoute,
              private _router:Router,
              private contentManagementService:ContentManagementService,
              private capitalPipe: CapitalizePipe,
              private alertFooter: AlertFooterService,
              private featureToggleService: FeatureToggleService,
              private msgFeedService: MsgFeedService){}

  ngOnInit(){
    this.setToggleFeature();
    this.loadDomains();
    this.route.params.subscribe(
      params => {
        if(!this.validateUrlParams(params)) this._router.navigateByUrl('/404');
        if(params['section'] !== this.curSection){
          this.curSection = params['section'];
          this.curSubSection = params['subsection']? params['subsection']:'';
          this.title = this.getSectionTitle(this.curSection);
          this.crumbs[1].breadcrumb = this.title;
          this.filterObj.section = this.curSection;
          this.filterObj.subSection = this.curSubSection;
          this.sortByModel[this.curSection] = {type: this.sortOptionsMap[this.curSection][0].value, sort:'asc'};
          this.loadQueryParamsFromURL(this.route.snapshot.queryParams);
          this.loadContent(this.filterObj, this.sortByModel[this.curSection], this.curPage);
        }
      });
  }

  setToggleFeature(){
    this.featureToggleService.checkFeatureToggle('cmsBtn').subscribe(
      res => {if(res) this.toggleBtn = res;},
      error => {// Still hide the button if error occurs}
    )
  }

  validateUrlParams(params):boolean{
    return this.validSections.indexOf(params['section']) !== -1;
  }

  /* update message feeds based on filter obj changes*/
  onFilterChange(filterObj){
    this.filterObj = filterObj;
    this.curPage = 0;
    this.updateURL();
    if(this.filterObj.section === this.curSection) this.loadContent(this.filterObj, this.sortByModel[this.filterObj.section], this.curPage);
  }

  /* update message feeds based on page num changes*/
  onPageNumChange(pageNum){
    this.curPage = pageNum;
    this.updateURL();
    if(this.filterObj.section === this.curSection) this.loadContent(this.filterObj, this.sortByModel[this.filterObj.section], this.curPage);
  }

  onSortModelChange(sortModel){
    this.curPage = 0;
    this.updateURL();
    if(this.filterObj.section === this.curSection) this.loadContent(this.filterObj, sortModel, this.curPage);
  }

  onCreateContentItem(){
    let navigationExtras: NavigationExtras = {queryParams: {}};
    navigationExtras.queryParams['mode'] = 'create';
    this._router.navigate(['/workspace/content-management/'+this.filterObj.section+'/edit'],navigationExtras);
  }

  onThumbnailImageError(item){
    document.getElementById(item.refId).src = "src/assets/img/logo-not-found.png";
  }

  /* search message feeds with filter, sortby, page number and order*/
  loadContent(filterObj, sort, page){
    this.noContentsInfo = 'Loading';
    this.contents = [];
    this.contentManagementService.getContent(filterObj, sort, page+1, this.recordsPerPage).subscribe(
      data => {
        try{
          // show the last page if the page is out of boundary
          this.totalRecords = data._embedded.contentDataWrapperList[0]['totalRecords'];
          this.totalPages = Math.ceil(this.totalRecords/this.recordsPerPage);
          if(page + 1 > this.totalPages && this.totalPages >= 1){
            this.curPage = this.totalPages - 1;
            this.loadContent(filterObj, sort, this.curPage);
          }else{
            this.contents = data._embedded.contentDataWrapperList[0]['contentDataList'];
            this.updateRecordsText();
            if(this.contents.length == 0) this.noContentsInfo = "No Content Available";
          }

        }catch (err){
          console.log(err);
          this.noContentsInfo = "No Content Available";
        }

      },
      error => {
        this.noContentsInfo = "No Content Available";
      });
  }

  loadDomains(){
    this.msgFeedService.getDomains().subscribe(data => {
      this.domainsMapping = data;
    })
  }

  updateRecordsText(){
    this.curStart = this.curPage * this.recordsPerPage + 1;
    this.curEnd = (this.curPage + 1) * this.recordsPerPage;
    if( this.curEnd >= this.totalRecords) this.curEnd = this.totalRecords;
    if( this.totalRecords === 0) this.curStart = 0;
  }

  updateURL(){
    let navigationExtras: NavigationExtras = {queryParams: {}};
    if(this.curPage > 0) navigationExtras.queryParams['page'] = this.curPage+1;
    if(this.filterObj.domains.length > 0) navigationExtras.queryParams['domain'] = this.filterObj.domains.join(',');
    if(this.filterObj.status.length > 0) navigationExtras.queryParams['status'] = this.filterObj.status.join(',');
    if(this.filterObj.keyword !== "") navigationExtras.queryParams['q'] = this.filterObj.keyword;
    if(this.sortByModel[this.curSection]['sort'] !== 'asc') navigationExtras.queryParams['order'] = this.sortByModel[this.curSection]['sort'] ;
    if(this.sortByModel[this.curSection]['type'] !== this.sortOptionsMap[this.curSection][0].value) navigationExtras.queryParams['sort'] = this.sortByModel[this.curSection]['type'];
    this._router.navigate(['/workspace/content-management/'+this.filterObj.section], navigationExtras);

  }

  loadQueryParamsFromURL(queryParams){
    if(queryParams['q'])this.filterObj.keyword = queryParams['q'];
    if(queryParams['status'])this.filterObj.status = queryParams['status'].split(',');
    if(queryParams['domains'])this.filterObj.domains = queryParams['domains'].split(',');
    if(queryParams['sort'])this.sortByModel[this.curSection]['type'] = queryParams['sort'];
    if(queryParams['order'])this.sortByModel[this.curSection]['sort'] = queryParams['order'];
    if(queryParams['page'])this.curPage = queryParams['page']-1;
  }

  getSectionTitle(section){
    let str_tokens = [];
    section.split('-').forEach( e => {
      str_tokens.push(e !== e.toUpperCase()? this.capitalPipe.transform(e):e);
    });
    return str_tokens.join(" ");
  }

  getThumbnailImage(item){
    if(item.thumbnailUrl == null) return "src/assets/img/logo-not-found.png";
    return item.thumbnailUrl;
  }

  onContentItemAction(action, item){
    switch(action.name){
      case 'Edit':
        let navigationExtras: NavigationExtras = {queryParams: {}};
        navigationExtras.queryParams['mode'] = 'edit';
        navigationExtras.queryParams['id'] = item.contentId;
        this._router.navigate(['/workspace/content-management/'+this.filterObj.section+'/edit'],navigationExtras);
        break;
      case 'Publish':
        item['status'] = 2;
        this.updateDataContent(item, 'Successfully published '+item.refId, 'Failed to publish '+item.refId);
        break;
      case 'Delete': case 'Delete Draft':
        item['activeStatus'] = false;
        this.updateDataContent(item, 'Successfully deleted '+item.refId, 'Failed to delete '+item.refId);
        break;
      case 'Unarchive':
        item['status'] = 3;
        this.updateDataContent(item, 'Successfully unarchived '+item.refId, 'Failed to unarchive '+item.refId);
        break;
      case 'Archive':
        item['status'] = 4;
        this.updateDataContent(item, 'Successfully archived '+item.refId, 'Failed to archive '+item.refId);
        break;
    }
  }

  updateDataContent(content, successMsg, errorMsg){
    this.contentManagementService.updateContent(content).subscribe(
      data => {
        this.showAlertMessage('success',successMsg);
        this.loadContent(this.filterObj, this.sortByModel[this.curSection], this.curPage);
      },
      err => {
        err.errorCode == null? this.showAlertMessage('error',errorMsg): this.showAlertMessage('error',errorMsg + ' Error code: ' + err.errorCode +'. ' + err.errorMessage );
        this.loadContent(this.filterObj, this.sortByModel[this.curSection], this.curPage);
      }
    );
  }

  getDomainStr(domains){
    if(domains == null) return 'Not Available';
    if(domains.length === 0) return 'Not Available';
    if(this.domainsMapping == null) return 'Not Available';
    let domainNames = [];
    domains.forEach(e => {domainNames.push(this.domainsMapping[e])});
    return domainNames.join(', ');
  }

  getTagStr(tags){
    let tagNames = [];
    tags.forEach(e => {tagNames.push(e.tagKey)});
    return tagNames.join(',');
  }

  getDurationText(durationSec){
    return moment("1900-01-01 00:00:00").add(durationSec, 'seconds').format("HH:mm:ss");
  }


  getAction(item){
    let actions = [];
    if(item.status){
      let status = item.status;
      switch (status){
        case 1: //New
          actions.push({icon:"fa fa-pencil", label:"Edit", name:"Edit", callback: ()=>{}});
          actions.push({icon:"fa fa-times", label:"Delete", name:"Delete", callback: ()=>{}});
          actions.push({icon:"", label:"Publish", name:"Publish", callback: ()=>{}});
          break;
        case 3: //Draft
          actions.push({icon:"fa fa-pencil", label:"Edit", name:"Edit", callback: ()=>{}});
          actions.push({icon:"fa fa-times", label:"Delete Draft", name:"Delete Draft", callback: ()=>{}});
          actions.push({icon:"", label:"Publish", name:"Publish", callback: ()=>{}});
          break;
        case 2: //Publish
          if(!item.draftExist) actions.push({icon:"fa fa-pencil", label:"Edit", name:"Edit", callback: ()=>{}});
          actions.push({icon:"fa fa-times", label:"Archive", name:"Archive", callback: ()=>{}});
          break;
        case 4: //Archived
          actions.push({icon:"", label:"Unarchive", name:"Unarchive", callback: ()=>{}});
          break;
      }
    }
    return actions;
  }

  showAlertMessage(type,message){
    this.alertFooter.registerFooterAlert({
      title: "",
      description: message,
      type: type,
      timer: 3200
    });
  }

}
