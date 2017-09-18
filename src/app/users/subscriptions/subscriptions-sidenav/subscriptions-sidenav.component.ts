import { Component, Output, Input, EventEmitter } from '@angular/core';
import { IBreadcrumb, OptionsType } from "sam-ui-kit/types";
import { SubscriptionsService } from "api-kit/subscriptions/subscriptions.service";

@Component({
  selector: 'subscriptions-sidenav',
  templateUrl: 'subscriptions-sidenav.template.html'
})
export class SubscriptionsSideNavComponent{

  @Output() filterChange:EventEmitter<any> = new EventEmitter<any>();

  navLinks = [
    { text: 'Personal Details', routerLink: ['/profile/details'] },
    { text: 'Reset Password',   routerLink: ['/profile/password'] },
    { text: 'My Roles',  routerLink: ['/profile/role-details'] },
    { text: 'Role Migrations',  routerLink: ['/profile/migrations'] },    
    { text: 'Manage Subscriptions', active: true },
  ];

  filterOption = {
    keyword:"",
    feedType:[],
    frequency:[],
    domains:[],
  };

  cbxControl = {
    domains: true,
    frequency: true,
    feedType: true,
  };

  feedTypeCbxConfig = {
    options: [
      {value: 'Shown in My Feed', label: 'Shown in My Feed', name: 'Shown in My Feed'},
      {value: 'Not shown in My Feed', label: 'Not shown in My Feed', name: 'Not shown in My Feed'},
    ],
    name: 'My Feed',
    label: 'My Feed',
  };

  frequencyCbxConfig = {
    options: [
      {value: 'Immediate', label: 'Immediate', name: 'Immediate'},
      {value: 'Daily', label: 'Daily', name: 'Daily'},
      {value: 'Weekly', label: 'Weekly', name: 'Weekly'},
      {value: 'None', label: 'None', name: 'None'},
    ],
    name: 'Frequency',
    label: 'Frequency',
  };

  domainsCbxConfig = {
    options: [],
    name: 'Domains',
    label: 'Domains',
  };

  constructor(private subscriptionsService: SubscriptionsService){}

  ngOnInit(){
    this.setCbxControl();
    this.loadFilterData();
  }

   subscriptionFilterOptionChange(){
    // emit event for subscription filter to search for current filter messages
    this.filterChange.emit(this.filterOption);
  }

  /* Set up proper checkbox to show on each section or subsection*/
  setCbxControl(){
    Object.keys(this.cbxControl).forEach( key => {this.cbxControl[key] = true;});
  }

  resetFilterFields(){
    this.filterOption.keyword = "";
    this.filterOption.feedType = [];
    this.filterOption.frequency = [];
    this.filterOption.domains = [];
  }

  loadFilterData(){
    this.loadDomains();
  }

  loadDomains(){
    this.subscriptionsService.getDomains().subscribe(res => {
      this.domainsCbxConfig.options = [];
      res.Domains.forEach(domain => {this.domainsCbxConfig.options.push({value: domain, label: domain, name: domain});});
    });
  }
}
