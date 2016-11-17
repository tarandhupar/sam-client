import { Component,OnInit } from '@angular/core';
import { Router,NavigationExtras,ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { SearchService } from 'api-kit';

@Component({
  moduleId: __filename,
  selector: 'search',
  styleUrls: [
    'search.style.css'
  ],
  providers: [],
  templateUrl: 'search.template.html'
})

export class SearchPage implements OnInit{
	indexes = ['', 'cfda', 'fbo'];
	index = '';
	organizationId:string = '';
  sourceOrganizationId:string = '';
	pageNum = 0;
	totalCount: any= 0;
	totalPages: any= 0;
	pageNumPaginationPadding = 2;
	showPerPage = 10;
	data = [];
	keyword: string = "";
	oldKeyword: string = "";
	initLoad = true;
	showOptional:any = (SHOW_OPTIONAL=="true");

	constructor(private activatedRoute: ActivatedRoute, private router: Router, private searchService: SearchService) { }
	ngOnInit() {
		this.activatedRoute.queryParams.subscribe(
			data => {
				this.keyword = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : "";
				this.index = typeof data['index'] === "string" ? decodeURI(data['index']) : this.index;
				this.pageNum = typeof data['page'] === "string" && parseInt(data['page'])-1 >= 0 ? parseInt(data['page'])-1 : this.pageNum;
        this.organizationId = typeof data['organizationId'] === "string" ? decodeURI(data['organizationId']) : "";
        this.runSearch();
		});
	}

	loadParams(){
		var qsobj = this.setupQS(false);
		this.searchService.loadParams(qsobj);
	}

	onOrganizationChange(orgId:any[]){
		console.log("new org",orgId);
    this.organizationId = orgId.reduce(function(finalStr,val,idx){
    	if(idx==0){
    		return val.value;
    	} else {
    		return finalStr;// + "," + val.value;
    	}
    },"");
    this.loadParams();
	}

	onSearchClick($event) {
      this.keyword = $event.keyword;
      this.index = $event.searchField;
      this.runSearch();
    }
  setupQS(newsearch){
  	var qsobj = {};
  	if(this.organizationId.length>0){
			qsobj['organizationId'] = this.organizationId;
		}
		if(this.keyword.length>0){
			qsobj['keyword'] = this.keyword;
		}
		if(this.index.length>0){
			qsobj['index'] = this.index;
		} else {
      qsobj['index'] = '';
    }
		if(!newsearch && this.pageNum>=0){
			qsobj['page'] = this.pageNum+1;
		}
		else{
			qsobj['page'] = 1;
		}
		return qsobj;
  }
	runSearch(){
		//make api call
		this.searchService.runSearch({
			keyword: this.keyword,
			index: this.index,
			pageNum: this.pageNum,
      organizationId: this.organizationId
		}).subscribe(
			data => {
	      if(data._embedded && data._embedded.results){
	        for(var i=0; i<data._embedded.results.length; i++) {
	          if(data._embedded.results[i].fhNames){
	            if(!(data._embedded.results[i].fhNames instanceof Array)){
	              data._embedded.results[i].fhNames = [data._embedded.results[i].fhNames];
	            }
	          }
	        }
	        this.data = data._embedded;
          this.totalCount = data.page['totalElements'];
          var maxAllowedPages = data.page['maxAllowedRecords']/this.showPerPage;
          this.totalPages = data.page['totalPages']>maxAllowedPages?maxAllowedPages:data.page['totalPages'];
	      } else{
	      	this.data['results'] = null;
	      }

				this.oldKeyword = this.keyword;
				this.initLoad = false;
			},
      error => {
        console.error("Error!!", error);
      }
    );
	}

	pageChange(pagenumber){
		this.pageNum = pagenumber;
		var qsobj = this.setupQS(false);
		let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/search'],navigationExtras);
	}

	createRange(number){
	  var items: number[] = [];
	  for(var i = 1; i <= number; i++){
	     items.push(i);
	  }
	  return items;
	}

	showPageButton(idx){
		var retVal = false;
		if(idx==0 || idx==this.totalPages-1){
			retVal = true;
		} else {
			retVal = Math.abs(this.pageNum-idx)<=this.pageNumPaginationPadding;
		}

		return retVal;
	}
}
