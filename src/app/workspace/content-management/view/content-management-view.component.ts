import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { IBreadcrumb, OptionsType } from "sam-ui-kit/types";
import { ContentManagementService } from "api-kit/content-management/content-management.service";
import { CapitalizePipe } from "../../../app-pipes/capitalize.pipe";
import { Observable } from 'rxjs';

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

  title:string = "";
  curSection:string = "";
  curSubSection:string = "";

  validSections = ['data-dictionary','video-library', 'FAQ-repository'];

  sortByModel = {
    'FAQ-repository': {type: 'latest update', sort: 'asc' },
    'data-dictionary': {type: 'alphabetical', sort: 'asc' },
    'video-library': {type: 'relevance', sort: 'asc' },
  };

  sortOptionsMap = {
    'FAQ-repository': [{label:'Latest Update', name:'Latest Update', value:'latest update'}],
    'data-dictionary': [{label:'Alphabetical', name:'Alphabetical', value:'alphabetical'}],
    'video-library': [
      {label:'Alphabetical', name:'Alphabetical', value:'alphabetical'},
      {label:'Relevance', name:'Relevance', value:'relevance'}],
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

  createTextMap = {
    'data-dictionary': "New Definition",
    'FAQ-repository': "New Question",
    'video-library': "New Video",
  };

  constructor(private route:ActivatedRoute, private _router:Router, private contentManagementService:ContentManagementService, private capitalPipe: CapitalizePipe){}

  ngOnInit(){
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

  /* search message feeds with filter, sortby, page number and order*/
  loadContent(filterObj, sort, page){
    let content;
    if(filterObj.section.toLowerCase().includes('data')){
      content = this.contentManagementService.getDataDictionaryContent(filterObj, sort, page, this.recordsPerPage);
    }else if(filterObj.section.toLowerCase().includes('faq')){
      content = this.contentManagementService.getFAQContent(filterObj, sort, page, this.recordsPerPage);
    }else if(filterObj.section.toLowerCase().includes('video')){
      content = this.contentManagementService.getVideoLibraryContent(filterObj, sort, page, this.recordsPerPage);
    }
    content.subscribe(data => {
      this.contents = data['contents'];
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

  onContentItemAction(action, index){
    // 1. Direct to Edit page on action edit
    // 2. Delete current content item on action delete

  }


}
