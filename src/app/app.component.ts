
/*
 * Angular 2 decorators and services
 */
import { Component } from '@angular/core';
import { Router, NavigationExtras,ActivatedRoute } from '@angular/router';
import { globals } from './globals.ts';
import { SearchService } from 'api-kit';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  templateUrl: './app.template.html',
  providers : [SearchService]
})
export class App{

  keyword: string = "";
  index: string = "";
  qs: any = {};

  showOverlay = false;

  constructor(private _router: Router,private activatedRoute: ActivatedRoute, private searchService: SearchService) {}

  ngOnInit() {
    this.searchService.paramsUpdated$.subscribe(
      obj => {
        this.setQS(obj);
      });
    this.activatedRoute.queryParams.subscribe(
      data => {
        if(typeof data['keyword'] === "string") {
          window.localStorage.setItem("keyword", decodeURI(data['keyword']));
        }
        if(typeof data['index'] === "string") {
          window.localStorage.setItem("index", decodeURI(data['index']));
        }
        this.checkCookie();
        this.keyword = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : this.keyword;
        this.index = typeof data['index'] === "string" ? decodeURI(data['index']) : this.index;
      });
    this._router.events.subscribe(
      val => {
        this.showOverlay = false;
      });
  }

  get isHeaderWithSearch() {
    return globals.isDefaultHeader;
  }

  onHeaderSearchEvent(searchObject) {
    var qsobj = this.qs;
    if(searchObject.keyword.length>0){
      qsobj['keyword'] = searchObject.keyword;
    } else {
      qsobj['keyword'] = '';
    }
    if(searchObject.searchField.length>0){
      qsobj['index'] = searchObject.searchField;
    } else {
      qsobj['index'] = '';
    }

    qsobj['page'] = 1;
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };

    window.localStorage.setItem("keyword", qsobj['keyword']);
    window.localStorage.setItem("index", qsobj['index']);

    this._router.navigate(['/search'], navigationExtras );

    return false;
  }

  setQS(obj){
    this.qs = obj;
  }

  toggleOverlay(value){
    this.showOverlay = value;

  }

  checkCookie() {
    if(window.localStorage.getItem("keyword")!==null) {
      this.keyword = window.localStorage.getItem("keyword");
    }
    if(window.localStorage.getItem("index")!==null) {
      this.index = window.localStorage.getItem("index");
    }
  }

}
