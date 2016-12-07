import { Component } from '@angular/core';
import { Router,NavigationExtras } from '@angular/router';
import { globals } from '../../globals.ts';

@Component({
  selector: 'home',
  providers: [ ],
  templateUrl: 'home.template.html'
})
export class HomePage {

  topicDetails = {
    'XYZ1': 'Bacon ipsum dolor amet picanha frankfurter jerky, cupim tongue drumstick filet',
    'XYZ2': 'Spicy jalapeno bacon ipsum dolor amet ullamco pariatur.',
    'XYZ3': 'Aliqua andouille aliquip cillum sunt bacon. Turkey pork.',
    'XYZ4': 'Non duis porchetta fatback prosciutto. Ribeye fatback labore'
  };
  curTopicTitle = 'XYZ1';
  curTopicDetail = this.topicDetails[this.curTopicTitle];
  showDetail = false;

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
    } else {
      qsobj['index'] = '';
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

  setClasses(topic):any{
    if(topic === this.curTopicTitle){
      return {"tri-down":true,"no-tri-down":false};
    }
    return {"tri-down":false,"no-tri-down":true};

  }

}
