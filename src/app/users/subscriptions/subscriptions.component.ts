import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBreadcrumb, OptionsType } from "sam-ui-elements/src/ui-kit/types";
import { SubscriptionsService } from "api-kit/subscriptions/subscriptions.service";
import { WatchlistService } from "api-kit/watchlist/watchlist.service";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";
import { SamActionInterface } from "sam-ui-elements/src/ui-kit/components/actions";
import { Watchlist } from '../../app-components/watchlist/watchlist.model';
import { WatchlistType } from "api-kit/watchlist/watchlist.service";
import {AlertFooterService} from "../../app-components/alert-footer/alert-footer.service";

@Component({
  templateUrl: './subscriptions.template.html',
})
export class SubscriptionsComponent {

  @ViewChild('bulkUpdateModal') bulkUpdateModal;
  @ViewChild('unsubscribeModal') unsubscribeModal;
  modalConfig = {title:'Confirm Action', description:''};

  fieldName = 'active';
  fieldValue = 'N';

  private crumbs: Array<IBreadcrumb> = [
    { url: '/profile', breadcrumb: 'Profile' },
    { breadcrumb: 'Followings' }
  ];
 
  recordsPerPage = 10;
  dropdownStyles = {border:'0px', outline:'0px', "background-color": 'transparent', "min-width": '120px'};
  dropdownStylesActions = {border:'0px', outline:'0px', "background-color": 'transparent', "min-width": '170px'};

  sortByModel = {type: 'date', sort: 'desc' };
  msgSortOptions = [{label:'Last Modified', name:'Last Modified', value:'date'}, {label:'Name', name:'Name', value:'name'}, {label:'Type', name:'Type', value:'type'}];

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

  actions: Array<any> = [
    { label: "Email Frequency",
      options: [{ label: 'Immediate', name: 'instant'},
      { label: 'Daily', name: 'daily'},
      { label: 'Weekly', name: 'weekly'},
      { label: 'None', name: 'none'}]
    },
    { label: "Unfollow",
      name: "unsubscribe"
    },
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
    ids:[]
  };
  subscriptions = [];
  userDomains = [];

  selectedAll = false;
  allMatchingSelected = false;
  selectOptions = [
  ];

  successFooterAlertModel = {
    title: "Success",
    description: "Unfollow Successful.",
    type: "success",
    timer: 3000
  }

  errorFooterAlertModel = {
    title: "Error",
    description: "Error in Unfollow.",
    type: "error",
    timer: 3000
  }

  follow:WatchlistType = {};

  constructor(private route:ActivatedRoute, private _router:Router, private subscriptionsService:SubscriptionsService, private watchlistService:WatchlistService, private capitalPipe: CapitalizePipe, private alertFooterService: AlertFooterService){}

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
    this.loadSubscriptions(this.filterObj, this.sortByModel,  this.curPage, true) ;
  }


  /* search subscriptions with filter, sortby, page number and order*/
  loadSubscriptions(filterObj, sortBy, page, fromPageChange = false){
    this.subscriptionsService.getSubscriptions(filterObj, sortBy, page, this.recordsPerPage).subscribe(data => {
      this.filterObj.ids = [];
      this.selectedAll = false;
      if(!fromPageChange) {
        this.allMatchingSelected = false;
      }
      if(data) {
        this.selectOptions = [];
        data['recordList'].forEach((d) => {
           if(d.modifiedDate) {
             d.modifiedDate = new Date(d.modifiedDate);
           }
           d.active = 'Y';
           if(!d.title) {
             d.title = d.record_id;
           }
           let obj:any = {};
           obj.selected = false;
           obj.id = d.id;
           this.selectOptions.push(obj);

           let acts = [];
           //d.interestedVendor = true;
           //let acts = [{label: "Action", name: "action", value: "-1"}];
           //let acts = [{label: "Action", name: "action", value: "-1"}, {label: "Interested Vendor", name: "action", value: "Interested Vendor"}];
           if(d.isInterestedVendor) {
             d.currStatus = "Interested Vendor";
             acts.push({label: "Interested Vendor", name: "action", value: "Interested Vendor"});
           } else {
             d.currStatus = "Following";
             acts.push({label: "Following", name: "action", value: "Following"});
            // acts.push({label: "Follow", name: "action", value: "Follow"});
           }
           if(d.actions) {
             let actionsArr = d.actions.split(',');
             if(actionsArr) {
              actionsArr.forEach((a) => {
                let opt:any = {};
                opt.label = a;
                opt.name = a;
                opt.value = a;
                acts.push(opt);
              });
              d.actions = acts;
             }
           }
         });
        this.subscriptions = data['recordList'];
        this.totalRecords = data['totalRecords'];
        let resDomains = data['userDomains'];
        this.userDomains = [];
        Object.keys(resDomains).forEach((key) => {
            let  result:any = {};
            result.id = key;
            result.desc = resDomains[key];
            this.userDomains.push(result);
        });
       // this.userDomains = resDomains; //(resDomains) ? resDomains.split(",") : [];
        this.totalPages = Math.ceil(this.totalRecords/this.recordsPerPage);
        this.updateRecordsText();

        if(this.allMatchingSelected) {
          this.selectedAll = true;
          this.selectOptions.forEach(e => {
                                  e.selected = this.selectedAll;
                                  if(this.selectedAll) {
                                    this.filterObj.ids.push(e.id); 
                                  }
                                } );
        }
     
        if(this.curPage + 1 > this.totalRecords) {
          this.curPage =  this.totalPages - 1;
          this.loadSubscriptions(filterObj, sortBy, this.curPage);
        /* this.subscriptionsService.getSubscriptions(filterObj, sortBy, this.curPage, this.recordsPerPage).subscribe(data => {
              this.subscriptions = data['recordList'];
              this.totalRecords = data['totalRecords'];
              this.totalPages = Math.ceil(this.totalRecords/this.recordsPerPage);
              this.updateRecordsText();
            });*/
        }
      } else {
        this.subscriptions = [];
        this.totalRecords = 0;
        this.curPage = 0;
        this.totalPages = 0;
        this.updateRecordsText();
      }
    },
    e => {
      console.log("Error loading subscriptions : " + e);
      this.registerFooteralert(false, "Error loading subscriptions");
    });
  }


  updateRecordsText(){
    this.curStart = this.curPage * this.recordsPerPage + 1;
    this.curEnd = (this.curPage + 1) * this.recordsPerPage;
    if( this.curEnd >= this.totalRecords) this.curEnd = this.totalRecords;
    if( this.totalRecords === 0) this.curStart = 0;
  }

  registerFooteralert(success , msg) {
    if(success) {
       this.successFooterAlertModel.description = msg;
       this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.successFooterAlertModel)));
    } else {
       this.errorFooterAlertModel.description = msg;
       this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.errorFooterAlertModel)));
    }
  }

  onFrequencyTypeSelect(new_frequency, selected_id){
    console.log('New Value: ' + new_frequency);
    console.log('id: ' + selected_id);
    let watchlist = {
      id : selected_id,
      frequency : new_frequency
    }
    this.watchlistService.updateWatchlist(watchlist).subscribe(resWatch => {
      let updatedWatchlist = Watchlist.FromResponse(resWatch);
      console.log("Successfully changed frequecy.");
      this.registerFooteralert(true, "Frequency updated for record: " + updatedWatchlist.recordId());
      this.loadSubscriptions(this.filterObj, this.sortByModel,  this.curPage);    
     },
     e => {
       this.registerFooteralert(false , "Error updating Frequency"); 
       console.log("Error updating frequency " + e);
      } ); 
  }

  onMyFeedCheck(val, selected_id){
    let feed;
    (val.length == 0) ? feed = 'N': feed = 'Y';
    console.log('feed: ' + feed);
    let watchlist = {
      id : selected_id,
      myFeed : feed
    }
    this.watchlistService.updateWatchlist(watchlist).subscribe(resWatch => {
      let updatedWatchlist = Watchlist.FromResponse(resWatch);
      console.log("Successfully changed MyFeed indicator.");
      this.registerFooteralert(true, "MyFeed indicator updated for record: " + updatedWatchlist.recordId());
      this.loadSubscriptions(this.filterObj, this.sortByModel,  this.curPage); 
     },
     e => {
       this.registerFooteralert(false , "Error updating MyFeed indicator"); 
       console.log("Error updating frequency " + e);
      } ); 
  }

   shorten(text, maxLength = 25) {
    let ret: string = text;
    if (ret.length > maxLength) {
     ret = ret.substr(0,maxLength) + '…';
    }
    return ret;
  }

  /*handleSubscriptionChange(watchlist) {
    this.registerFooteralert(true, "You are now unsubscribed from: " + watchlist.recordId());
    this.loadSubscriptions(this.filterObj, this.sortByModel,  this.curPage);
  }*/

  /* Get css classes*/
  getOrderByClass(){return "fa-sort-amount-" + this.orderByOptions[this.orderByIndex];}
  getAlertFeedClass(feed){return "usa-alert-" + feed.alertType.toLowerCase();}

  selectAll() {
    this.filterObj.ids = [];
    this.allMatchingSelected = false;
    this.selectOptions.forEach(e => {
                                  e.selected = this.selectedAll;
                                  if(this.selectedAll) {
                                    this.filterObj.ids.push(e.id); 
                                  }
                               } );
    console.log("selectedAll value is : " + this.selectedAll);
  }

  selectAllMatching() {
    this.allMatchingSelected = true;
   // this.filterObj.ids = [];
  }

  checkIfAllSelected(option) {
    this.allMatchingSelected = false;
    if(option.selected) {
      this.filterObj.ids.push(option.id);
    } else {
      this.filterObj.ids = this.filterObj.ids.filter(e => e !== option.id);
    }
    this.selectedAll = this.selectOptions.every(e => e.selected == true);
    //Display matching filter messsage
  }

  confirmAction(action) {
      if(action !== 'unsubscribe') {
        this.fieldName = 'frequency';
        this.fieldValue = action;
      } else {
        this.fieldName = 'active';
        this.fieldValue = 'N';
      } 
      if(this.allMatchingSelected || (!this.allMatchingSelected && this.filterObj.ids.length > 0)) {
        let recordsToUpdate = 0;
        if(this.allMatchingSelected) {
          recordsToUpdate = this.totalRecords;
        } else {
          recordsToUpdate = this.filterObj.ids.length;
        }

        if(this.fieldName == 'frequency') {
         // this.modalConfig.description = 'Are you sure you wish to change email frequency to ' + this.fieldValue + '? This will update ' + recordsToUpdate + ' records.';
         this.performBulkUpdate();
         return;
        } else {
          this.modalConfig.description = 'Are you sure you wish to unfollow? This will update ' + recordsToUpdate + ' records.';
        }
        this.bulkUpdateModal.openModal();
      }
  }

  confirmOption(event, id) {
    let active;
    let evl;
    if(event === 'Unfollow') {
      active = 'N';
      evl = false;
    } else if(event === 'Interested Vendor') {
      evl = true;
    } else if(event === 'Follow') {
      evl = false;
    } else {
      return;
    }

    this.follow = {};
    this.follow.id = id;
    this.follow.active = active;
    this.follow.interestedVendor  = evl;
    this.modalConfig.description = 'Are you sure you wish to change to ' + event + '?';
    this.unsubscribeModal.openModal();
  }

  onUnsubscribeModalSubmit() {
    this.unsubscribeModal.closeModal();
    this.saveSubscription();
  }

  saveSubscription() {
      //Save subscription
      this.watchlistService.updateWatchlist(this.follow).subscribe(resWatch => {
      let updatedWatchlist = Watchlist.FromResponse(resWatch);
      console.log("Successfully changed Subscription Action.");
      this.registerFooteralert(true, "Following updated for record: " + updatedWatchlist.recordId());
      this.loadSubscriptions(this.filterObj, this.sortByModel,  this.curPage); 
     },
     e => {
       this.registerFooteralert(false , "Error updating Following"); 
       console.log("Error updating subscription " + e);
      } ); 
  }

  onBulkUpdateModalSubmit() {
    this.bulkUpdateModal.closeModal();
    this.performBulkUpdate();

  }
  
  performBulkUpdate() {
      this.subscriptionsService.updateSubscriptions(this.filterObj, this.allMatchingSelected, this.fieldName, this.fieldValue).subscribe(res => {
      let recordsUpdated = res.recordsUpdated;
      console.log("Successfully updated " + recordsUpdated);
      if(this.fieldName === 'active') {
        this.registerFooteralert(true, recordsUpdated + " records unfollowed." );
      } else {
        this.registerFooteralert(true, recordsUpdated + " records updated." );
      }
      this.loadSubscriptions(this.filterObj, this.sortByModel,  0);    
    },
    e => {
      this.registerFooteralert(false , "Error updating records"); 
      console.log("Error updating records " + e); 
      } ); 
  }
}
