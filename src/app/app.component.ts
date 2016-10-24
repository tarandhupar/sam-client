/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { Router, NavigationExtras,ActivatedRoute } from '@angular/router';
import { ComponentInjectService } from './common/service/component.inject.service.ts';
import { InputTypeConstants } from './common/constants/input.type.constants.ts';
import { globals } from './globals.ts';

//TODO: Remove samuikit.js (Deprecated)
import '../assets/js/samuikit.js';
//ENDTODO

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
  providers : [ComponentInjectService,InputTypeConstants]
})
export class App{

  keyword: string = "";
  index: string = "";


  constructor(private _router: Router,private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
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
    var qsobj = {};
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
}
