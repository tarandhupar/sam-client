import { Component, Output, Input, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { IBreadcrumb, OptionsType } from "sam-ui-kit/types";
import { SubscriptionsService } from "api-kit/subscriptions/subscriptions.service";
import { SidenavService } from "sam-ui-kit/components/sidenav/services/sidenav.service";
import { SidenavHelper } from "../../../app-utils/sidenav-helper";
import { Observable } from 'rxjs';
import { ToggleService } from "api-kit/toggle/toggle.service";

@Component({
  selector: 'subscriptions-sidenav',
  templateUrl: 'subscriptions-sidenav.template.html',
  providers: [
    SidenavHelper
  ]
})
export class SubscriptionsSideNavComponent implements OnInit, OnChanges{

  @Input() domains: any[] = [];

  @Output() filterChange:EventEmitter<any> = new EventEmitter<any>();

  navLinks = [
    { text: 'Personal Details', routerLink: ['/profile/details'] },
    { text: 'Reset Password',   routerLink: ['/profile/password'] },
    { text: 'My Roles',  routerLink: ['/profile/access'] },
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
      {value: 'Y', label: 'Shown in My Feed', name: 'Shown in My Feed'},
      {value: 'N', label: 'Not Shown in My Feed', name: 'Not Shown in My Feed'},
    ],
    name: 'My Feed',
    label: 'My Feed',
  };

  frequencyCbxConfig = {
    options: [
      {value: 'instant', label: 'Immediate', name: 'Immediate'},
      {value: 'daily', label: 'Daily', name: 'Daily'},
      {value: 'weekly', label: 'Weekly', name: 'Weekly'},
      {value: 'none', label: 'None', name: 'None'},
    ],
    name: 'Frequency',
    label: 'Frequency',
  };

  domainsCbxConfig = {
    options: this.domains,
    name: 'Domains',
    label: 'Domains',
  };

  sidenavModel = {
    "label": "Subscriptions",
    "children": []
  };

  constructor(private subscriptionsService: SubscriptionsService, private sidenavService: SidenavService, private sidenavHelper: SidenavHelper,private toggleService: ToggleService){}

  ngOnInit(){
    this.toggleService.getToggleStatus('enablemanagesubscription','/wl').subscribe(isEnabled => {
          console.log("subscriptions-sidenav page enablemanagesubscription >>>>>"+isEnabled);
          if(!isEnabled){
             for(var i=this.navLinks.length-1; i>=0; i--) {
               if( this.navLinks[i].text == "Manage Subscriptions") {
                  this.navLinks.splice(i,1); break;
               }
             }
         }  
     }) ;
    this.setCbxControl();
    this.loadFilterData();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges on sidenav called');
    if (changes['domains']) {
        console.log('changes detetect to domains: ' + JSON.stringify(changes['domains']));
        this.domains = changes['domains'].currentValue;
        this.loadDomains();
     }
  }

   subscriptionFilterOptionChange(){
    // emit event for subscription filter to search for current filter messages
    this.filterChange.emit(this.filterOption);
  }

  /* Set up proper checkbox to show on each section or subsection*/
  setCbxControl(){
    Object.keys(this.cbxControl).forEach( key => {this.cbxControl[key] = true;});
  }

  // resetFilterFields(){
  //   this.filterOption.keyword = "";
  //   this.filterOption.feedType = [];
  //   this.filterOption.frequency = [];
  //   this.filterOption.domains = [];
  // }

  loadFilterData(){
    this.loadDomains();
  }

  loadDomains(){
    console.log("Domains : " + JSON.stringify(this.domains));
    Observable.of(this.domains).subscribe(res => {
      this.domainsCbxConfig.options = [];
      res.forEach(domain => {this.domainsCbxConfig.options.push({value: domain, label: domain, name: domain});});
      console.log("Domains Combo: " + JSON.stringify(this.domainsCbxConfig.options));
    });
  }

  selectedItem(item) {
    //this.selectedPage = this.sidenavService.getData()[0];
  }

  sidenavPathEvtHandler(data) {
    this.sidenavHelper.sidenavPathEvtHandler(this, data);
  }

  onClearAllClick() {
      this.filterOption = {
      keyword:"",
      feedType:[],
      frequency:[],
      domains:[],
    };

    this.filterChange.emit(this.filterOption);
  }

}
