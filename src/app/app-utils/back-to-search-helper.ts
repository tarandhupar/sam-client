import { Injectable } from '@angular/core';
import { ActivatedRoute,} from '@angular/router';
import * as _ from 'lodash';

@Injectable()
export class BackToSearch {
  keyword: string = "";
  index: string = "";
  organizationId:string = '';
  previousStringList:string = '';
  pageNum = 0;
  totalCount: any= 0;
  totalPages: any= 0;
  showPerPage = 10;
  data = [];
  featuredData = [];
  oldKeyword: string = "";
  initLoad = true;
  showOptional:any = (SHOW_OPTIONAL=="true");
  qParams:any = {};
  isActive: boolean = true;
  isStandard: string = '';
  showRegionalOffices: boolean = false;
  ro_keyword: string = "";
  isSearchComplete : boolean = false;

  constructor(
    private activatedRoute:ActivatedRoute) {}

  getSearchParams() {
   this.activatedRoute.queryParams.subscribe(
      data => {
        this.keyword = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : this.keyword;
        this.index = typeof data['index'] === "string" ? decodeURI(data['index']) : this.index;
        this.pageNum = typeof data['page'] === "string" && parseInt(data['page'])-1 >= 0 ? parseInt(data['page'])-1 : this.pageNum;
        this.organizationId = typeof data['organizationId'] === "string" ? decodeURI(data['organizationId']) : "";
        this.isActive = data['isActive'] && data['isActive'] === "false" ? false : true;
        this.isStandard = data['isStandard'] && data['isStandard'] !== null ? data['isStandard'] : '';
        this.ro_keyword = typeof data['ro_keyword'] === "string" && this.showRegionalOffices ? decodeURI(data['ro_keyword']) : this.ro_keyword;
      });
  }
  
   setqParams(){
	this.getSearchParams();
    var qsobj = {};
    if(this.keyword.length>0){
      qsobj['keyword'] = this.keyword;
    } else {
      qsobj['keyword'] = '';
    }

    if(this.index.length>0){
      qsobj['index'] = this.index;
    } else {
      qsobj['index'] = '';
    }

    if(this.pageNum>=0){
      qsobj['page'] = this.pageNum+1;
    }
    else {
      qsobj['page'] = 1;
    }
    qsobj['isActive'] = this.isActive;

    if(this.organizationId.length>0){
      qsobj['organizationId'] = this.organizationId;
    }

    if(this.ro_keyword.length>0){
      qsobj['ro_keyword'] = this.ro_keyword;
    }

    return qsobj;
  }
}
