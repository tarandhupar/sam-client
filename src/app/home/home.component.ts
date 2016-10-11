import { Component } from '@angular/core';
import { Router,NavigationExtras } from '@angular/router';
import { globals } from '../common/constants/globals.ts';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [ ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './home.style.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.template.html'
})
export class Home {
  indexes = ['', 'cfda', 'fbo'];
  index = '';
  keyword: string = "";
  // Set our default values
  testValue = { value: 'Test' };
  // TypeScript public modifiers
  constructor(private _router:Router) {

  }

  ngOnInit() {
    globals.isDefaultHeader = false;
  }

  ngOnDestroy() {
    globals.isDefaultHeader = true;
  }


  runSearch(searchObject){
    var qsobj = {};
    if(searchObject.keyword.length>0){
      qsobj['keyword'] = searchObject.keyword;
    }
    if(searchObject.searchField.length>0){
      qsobj['index'] = searchObject.searchField;
    }
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this._router.navigate(['/search'], navigationExtras );

    return false;
  }


}
