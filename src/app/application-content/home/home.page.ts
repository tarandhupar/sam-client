import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { globals } from '../../globals';
import { AppState } from 'app/app.service';
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';


@Component({
  selector: 'home',
  providers: [ ],
  templateUrl: 'home.template.html'
})
export class HomePage {
  feedback: any;
  searchSelectConfig = {
    options: globals.searchFilterConfig,
    disabled: false,
    label: '',
    name: 'filter',
  };
  topicsData = [
    {
      title:'SAM.gov Transition Roadmap',
      detail:'The new SAM.gov has integrated all ten systems under one unified system. For more information on SAM.gov transition click ',
      url:'/help/transition',
      pageInProgress: true,
      inProgressDetail:'The new SAM.gov has integrated all ten systems under one unified system.'
    },
    {
      title:'Award Data',
      detail:'Gain access to data in a variety of formats. Perform searches, download extracts, and retrieve data through web services. For more information on award data click ',
      url:'/help/award',
      pageInProgress: true,
      inProgressDetail:'Gain access to data in a variety of formats. Perform searches, download extracts, and retrieve data through web services.'
    },
    {
      title:'New to SAM.gov',
      detail:'New to the site? For step by step information on the federal award process click ',
      url:'/help/new',
      pageInProgress: true,
      inProgressDetail: 'New to the site? See step by step information on the federal award process.'
    },
    {
      title:'User Accounts',
      detail:'Access information on how to sign up, update registration, and other ways to manage your user account click ',
      url:'/help/accounts',
      pageInProgress: false
    },

  ];

  curTopic: any;
  showDetail = false;


  constructor(private _router:Router, private state: AppState,  private formService: FeedbackFormService) {
  }

  ngOnInit() {
    this.state.set('isDefaultHeader',false);
    this.feedback = this.formService.componentInstance;
  }

  ngOnDestroy() {
    this.state.set('isDefaultHeader',true);
  }


  runSearch(searchObject){
    var qsobj = {};
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
    qsobj['isActive'] = true;
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this._router.navigate(['/search'], navigationExtras );

    return false;
  }

  selectTopic(item){
    this.showDetail = true;
    this.curTopic = item;
  }

  closeTopicDetail(){
    this.showDetail = false;
  }

  setClasses(index):any{
    if(this.topicsData[index].title === this.curTopic.title){
      return {"tri-down":true,"no-tri-down":false};
    }
    return {"tri-down":false,"no-tri-down":true};

  }

  linkToggle():boolean{
    return globals.showOptional;
  }
}
