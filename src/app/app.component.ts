
/*
 * Angular 2 decorators and services
 */
import { Component } from '@angular/core';
import { Router, NavigationExtras,NavigationEnd,ActivatedRoute } from '@angular/router';
import { globals } from './globals.ts';
import { SearchService } from 'api-kit';
import { FontChecker } from './app-utils/fontchecker';


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
  isActive: boolean = true;
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
    //for browsers that are blocking font downloads, add fallback icons
    new FontChecker("FontAwesome", {
        error: function() { document.getElementsByTagName("body")[0].classList.add("fa-fallback-icons"); }
    });

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
        if (val instanceof NavigationEnd) {
          const tree = this._router.parseUrl(this._router.url);
          if (tree.fragment) {
            const element = document.getElementById(tree.fragment);
            if (element) {
              element.scrollIntoView();
            }
          } else {
            window.scrollTo(0,0);
          }
        }
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

    //set regionalOffice filter keyword to null on header search event
    qsobj['ro_keyword'] = null;

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
    }
    if(searchObject.searchField !== 'fpds' && searchObject.searchField !== 'opp' && searchObject.searchField !== 'ent') {
      qsobj['naics'] = null;
      qsobj['psc'] = null;
      qsobj['duns'] = null;
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
