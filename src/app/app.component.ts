/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ComponentInjectService } from './common/service/component.inject.service.ts';
import { InputTypeConstants } from './common/constants/input.type.constants.ts';
import { APIService } from "./common/service/api/api.service";

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
  providers : [APIService,ComponentInjectService,InputTypeConstants]
})
export class App {
  constructor(private _router: Router) {

  }

  ngOnInit() {

  }

  onHeaderSearchEvent(searchText) {
    var qsobj = {
      keyword: searchText
    };
    // if(this.keyword.length>0){
    //   qsobj['keyword'] = this.keyword;
    // }
    // if(this.index.length>0){
    //   qsobj['index'] = this.index;
    // }
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this._router.navigate(['/search'], navigationExtras );
  }
}
