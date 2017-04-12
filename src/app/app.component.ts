
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
  isActive: boolean = false;
  qs: any = {};
  searchSelectConfig = {
    options: globals.searchFilterConfig,
    disabled: false,
    label: '',
    name: 'filter',
  };

  showOverlay = false;

  constructor(private _router: Router,private activatedRoute: ActivatedRoute, private searchService: SearchService) {}

  ngOnInit() {
    this.searchService.paramsUpdated$.subscribe(
      obj => {
        this.setQS(obj);
      });
    this.activatedRoute.queryParams.subscribe(
      data => {
        this.keyword = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : this.keyword;
        this.index = typeof data['index'] === "string" ? decodeURI(data['index']) : this.index;
        this.isActive = typeof data['isActive'] === "string" ? data['isActive'] : this.isActive;
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

    if(searchObject.searchField === 'fh') {
      qsobj['isActive'] = true;
    } else {
      qsobj['isActive'] = this.isActive;
    }
    if(searchObject.searchField !== 'wd') {
      qsobj['wdType'] = null;
      qsobj['state'] = null;
      qsobj['county'] = null;
      qsobj['conType'] = null;
      qsobj['service'] = null;
      qsobj['isEven'] = null;
      qsobj['cba'] = null;
      qsobj['prevP'] = null;
      qsobj['isStandard'] = null;
    }
    if(searchObject.searchField === 'wd' || searchObject.searchField === 'ent'){
      qsobj['organizationId'] = null;
    }
    if(searchObject.searchField !== 'fpds') {
      qsobj['awardOrIdv'] = null;
      qsobj['awardType'] = null;
      qsobj['contractType'] = null;
      qsobj['naics'] = null;
    }

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
