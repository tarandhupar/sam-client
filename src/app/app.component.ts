/*
 * Angular 2 decorators and services
 */
import { Cookie } from 'ng2-cookies';

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
        if(typeof data['keyword'] == "string" && typeof data['index'] == "string") {
          this.setCookie(data);
        } else {
          this.checkCookie();
        }
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

    Cookie.delete("term");
    Cookie.delete("ival");
    this._router.navigate(['/search'], navigationExtras );

    return false;
  }

  setQS(obj){
    this.qs = obj;
  }

  toggleOverlay(value){
    this.showOverlay = value;

  }

  setCookie(data) {
    Cookie.delete("term");
    Cookie.delete("ival");
    Cookie.set("term", data['keyword']);
    Cookie.set("ival", data['index']);
  }

  checkCookie() {
    let cookielist = Cookie.getAll();
    if(cookielist['term'] && cookielist['term'].length>0) {
      this.keyword = cookielist['term'];
    }
    if(cookielist['ival'] && cookielist['ival'].length>0) {
      this.index = cookielist['ival'];
    }
  }

}
