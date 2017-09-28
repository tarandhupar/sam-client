import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBreadcrumb, OptionsType } from "sam-ui-kit/types";
import { SubscriptionsService } from "api-kit/subscriptions/subscriptions.service";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";
import { SamActionInterface } from "sam-ui-kit/components/actions";

@Component({
  templateUrl: './subscriptions.template.html',
})
export class SubscriptionsComponent {

  private crumbs: Array<IBreadcrumb> = [
    { url: '/profile', breadcrumb: 'Profile' },
    { breadcrumb: 'Manage Subscriptions' }
  ];

  recordsPerPage = 10;
  dropdownStyles = {border:'0px', outline:'0px', "background-color": 'transparent', "min-width": '120px'};

  sortByModel = {type: 'date', sort: 'asc' };
  msgSortOptions = [{label:'Last Modified', name:'Last Modified', value:'date'}, {label:'Name', name:'Name', value:'date'}, {label:'Type', name:'Type', value:'date'}];

  frequencySelectConfig = {
    options:[
      {value: 'instant', label: 'Immediate', name: 'Immediate'},
      {value: 'daily', label: 'Daily', name: 'Daily'},
      {value: 'weekly', label: 'Weekly', name: 'Weekly'},
      {value: 'none', label: 'None', name: 'None'},
    ],
    label: '',
    name: 'Frequency',
    disabled: false,
  };

 myFeedCbxConfig = {
    options:[
      {value: 'Y', label: '', name: 'Yes'},
    ],
    label: '',
    name: 'MyFeed',
    disabled: false,
  };

  actions: Array<SamActionInterface> = [
    { label: 'Immediate', name: 'instant', callback: () => {} },
    { label: 'Daily', name: 'daily', callback: () => {} },
    { label: 'Weekly', name: 'weekly', callback: () => {} },
    { label: 'None', name: 'none', callback: () => {} },
  ];

  orderByIndex = 0;
  orderByOptions = ["asc","desc"];

  //current results num data variables
  curStart = 0;
  curEnd = 0;
  totalRecords = 0;

  //pagination variables
  curPage = 0;
  totalPages = 10;

  filterObj = {
    keyword:"",
    feedType:[],
    frequency:[],
    domains:[],
  };
  subscriptions = [];

  constructor(private route:ActivatedRoute, private _router:Router, private subscriptionsService:SubscriptionsService, private capitalPipe: CapitalizePipe){}

  ngOnInit(){
       this.loadSubscriptions(this.filterObj, this.sortByModel, this.curPage);
  }

  /* update subscriptions based on filter obj changes*/
  onFilterChange(filterObj){
    this.filterObj = filterObj;
    this.curPage = 0;
    this.loadSubscriptions(this.filterObj, this.sortByModel,  this.curPage);
  }

  /* update subscriptions based on sortBy field changes*/
  onSortSelectModelChange() {
    this.loadSubscriptions(this.filterObj, this.sortByModel, this.curPage);
  }

  /* update subscriptions based on page num changes*/
  onPageNumChange(pageNum){
    this.curPage = pageNum;
    this.loadSubscriptions(this.filterObj, this.sortByModel,  this.curPage);
  }


  /* search subscriptions with filter, sortby, page number and order*/
  loadSubscriptions(filterObj, sortBy, page){
    this.subscriptionsService.getSubscriptions(filterObj, sortBy, page, this.recordsPerPage).subscribe(data => {
      this.subscriptions = data['recordList'];
      this.totalRecords = data['totalRecords'];
      this.totalPages = Math.ceil(this.totalRecords/this.recordsPerPage);
      this.updateRecordsText();
    });
  }


  updateRecordsText(){
    this.curStart = this.curPage * this.recordsPerPage + 1;
    this.curEnd = (this.curPage + 1) * this.recordsPerPage;
    if( this.curEnd >= this.totalRecords) this.curEnd = this.totalRecords;
    if( this.totalRecords === 0) this.curStart = 0;
  }

  // onFrequencyTypeSelect(action, id){
  //   console.log('New Value: ' + action.name);
  //   console.log('id: ' + id);
  // }
  //
  // onMyFeedCheck(val, id){
  //   let feed;
  //   (val.length == 0) ? feed = 'N': feed = 'Y';
  //   console.log('feed: ' + feed);
  // }

  /* Get css classes*/
  getOrderByClass(){return "fa-sort-amount-" + this.orderByOptions[this.orderByIndex];}
  // getAlertFeedClass(feed){return "usa-alert-" + feed.alertType.toLowerCase();}

}
