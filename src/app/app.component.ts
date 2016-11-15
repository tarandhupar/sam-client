/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { Router, NavigationExtras,ActivatedRoute } from '@angular/router';
import { globals } from './globals.ts';
import { SearchService } from 'api-kit';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.style.css'
  ],
  templateUrl: './app.template.html',
  providers : [SearchService]
})
export class App{

  keyword: string = "";
  index: string = "";
  qs: any = {};

  showOverlay = false;

  constructor(private _router: Router,private activatedRoute: ActivatedRoute, private searchService: SearchService) {

  }

  ngOnInit() {
    this.searchService.paramsUpdated$.subscribe(
      obj => {
        this.setQS(obj);
    });
    this.activatedRoute.queryParams.subscribe(
      data => {
        this.keyword = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : "";
        this.index = typeof data['index'] === "string" ? decodeURI(data['index']) : "";
      });
  }


  get isHeaderWithSearch() {
    return globals.isDefaultHeader;
  }

  onHeaderSearchEvent(searchObject) {
    var qsobj = this.qs;
    if(searchObject.keyword.length>0){
      qsobj['keyword'] = searchObject.keyword;
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
    this._router.navigate(['/search'], navigationExtras );

    return false;
  }

  setQS(obj){
    this.qs = obj;
  }

  toggleOverlay(value){
    this.showOverlay = value;

  }
  
}
