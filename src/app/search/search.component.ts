import { Component,OnInit } from '@angular/core';
import { Http,RequestOptions, URLSearchParams } from '@angular/http';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/map';
import { SearchService } from '../common/service/search.service';

@Component({
  moduleId: __filename,
  selector: 'search',
  styleUrls: [
    'search.style.css'
  ],
  directives: [],
  providers: [SearchService],
  templateUrl: 'search.template.html'
})
export class Search implements OnInit{
	indexes = ['', 'cfda', 'fbo'];
	index = '';
	pageNum = 0;
	totalCount: any= 0;
	totalPages: any= 0;
	pageNumPaginationPadding = 2;
	data = [];
	keyword: string = "";
	initLoad = true;

	constructor(public http: Http,private activatedRoute: ActivatedRoute,private _router:Router, private searchService: SearchService) { }
	ngOnInit() {

		this.activatedRoute.queryParams.subscribe(
			data => {
				//console.log(data);
				this.keyword = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : "";
				this.index = typeof data['index'] === "string" ? decodeURI(data['index']) : this.index;
				this.pageNum = typeof data['page'] === "string" && parseInt(data['page'])-1 >= 0 ? parseInt(data['page'])-1 : this.pageNum;
				//if((this.keyword && this.keyword.length>0) || (this.index == '' || this.index)){
					this.runSearch(true);
				//}
		});
	}

	runSearch(newSearch){

		if(typeof window != "undefined"){
			var qsobj = {};
			if (!this.initLoad && history.pushState) {

				if(this.keyword.length>0){
					qsobj['keyword'] = this.keyword;
				}
				if(this.index.length>0){
					qsobj['index'] = this.index;
				}
				if(!newSearch && this.pageNum>=0){
					qsobj['page'] = this.pageNum+1;
				}
				else{
					this.pageNum=0;
				}
				var qsString = Object.keys(qsobj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(qsobj[k])}`).join('&');

		    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + qsString;
		    window.history.pushState({path:newurl},'',newurl);
			}
		}


		this.searchService.runSearch({
			keyword: this.keyword,
			index: this.index,
			pageNum: this.pageNum
		}).subscribe(
			data => {
				console.log("DATA!",data);
				this.data = data;
				this.totalCount = this.data['totalCount'];
				this.totalPages = this.data['totalPages'];

				this.initLoad = false;
			},
      error => {
        console.error("Error!!", error);
        //return Observable.throw(error);
      }
    );
	}

	pageChange(pagenumber){
		//console.log("test",pagenumber);
		this.pageNum = pagenumber;
		this.runSearch(false)
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
	//routing
	goHome(){
		this._router.navigate(['/home'],{queryParams:{}});
	}
}
