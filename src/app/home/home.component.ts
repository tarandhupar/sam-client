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

  topicDetails = {
    'XYZ1': 'Bacon ipsum dolor amet picanha frankfurter jerky, cupim tongue drumstick filet',
    'XYZ2': 'Spicy jalapeno bacon ipsum dolor amet ullamco pariatur.',
    'XYZ3': 'Aliqua andouille aliquip cillum sunt bacon. Turkey pork.',
    'XYZ4': 'Non duis porchetta fatback prosciutto. Ribeye fatback labore'
  };
  curTopicTitle = 'XYZ1';
  curTopicDetail = this.topicDetails[this.curTopicTitle];
  showDetail = false;

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
    console.log("Home Page");

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

  selectTopic(topic){
    this.showDetail = true;
    this.curTopicTitle = topic;
    this.curTopicDetail = this.topicDetails[this.curTopicTitle];
  }

  closeTopicDetail(){
    this.showDetail = false;
  }


}
