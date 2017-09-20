import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBreadcrumb, OptionsType } from "sam-ui-kit/types";
import { ContentManagementService } from "api-kit/content-management/content-management.service";
import { CapitalizePipe } from "../../../app-pipes/capitalize.pipe";

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

  sortByModel = {type: 'latest update', sort: 'asc' };
  contentSortOptions = [{label:'Latest Update', name:'Latest Update', value:'latest update'}];

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



  constructor(private route:ActivatedRoute, private _router:Router, private contentManagementService:ContentManagementService, private capitalPipe: CapitalizePipe){}

  ngOnInit(){
    this.route.params.subscribe(
      params => {
        if(!this.validateUrlParams(params)) this._router.navigateByUrl('/404');
        this.curSection = params['section'];
        this.curSubSection = params['subsection']? params['subsection']:'';
        this.title = this.getSectionTitle(this.curSection);
        this.crumbs[1].breadcrumb = this.title;
        this.filterObj.section = this.curSection;
        this.filterObj.subSection = this.curSubSection;
        this.loadContent(this.filterObj, this.sortByModel.type, this.sortByModel.sort, this.curPage);

      });
  }

  validateUrlParams(params):boolean{
    return this.validSections.indexOf(params['section']) !== -1;
  }

  /* update message feeds based on filter obj changes*/
  onFilterChange(filterObj){
    this.filterObj = filterObj;
    this.curPage = 0;
    this.loadContent(this.filterObj, this.sortByModel.type, this.sortByModel.sort, this.curPage);
  }

  /* update message feeds based on page num changes*/
  onPageNumChange(pageNum){
    this.curPage = pageNum;
    this.loadContent(this.filterObj, this.sortByModel.type, this.sortByModel.sort, this.curPage);
  }

  /* search message feeds with filter, sortby, page number and order*/
  loadContent(filterObj, sortBy, order, page){
    this.contentManagementService.getFAQContent(filterObj, sortBy, order, page, this.recordsPerPage).subscribe(data => {
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
