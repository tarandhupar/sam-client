import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { globals } from '../../globals.ts';

import { IAMService } from 'api-kit';

import { trigger, state, style, animate, transition } from '@angular/core';

@Component({
  selector: 'sam-header-links',
  templateUrl: 'header-links.component.html',
  providers: [IAMService],
  animations: [
    trigger('flyInOut', [
      state('in', style({
        height: '*',
        minHeight: '*',
        opacity: '1',
        overflow: '*'
      })),
      transition(':enter', [
        style({
          height: '0',
          minHeight: '0',
          overflow: 'hidden'
        }),
        animate('.3s .3s ease-in', style({
          height: '*',
          minHeight: '*',
          overflow: 'hidden'
        }))
      ]),
      transition(':leave', [
        style({
          height: '*',
          minHeight: '*',
          overflow: 'hidden'
        }),
        animate('.2s ease-out', style({
          height: '0',
          minHeight: '0',
          overflow: 'hidden'
        }))
      ])
    ]),
    trigger('fadeInOut', [
      state('in', style({
        opacity: '1',
      })),
      transition(':enter', [
        style({
          opacity: '0'
        }),
        animate('.1s .1s ease-in', style({
          opacity: '1'
        }))
      ]),
      transition(':leave', [
        style({
          opacity: '1'
        }),
        animate('.1s ease-out', style({
          opacity: '0'
        }))
      ])
    ])
  ]
})
export class SamHeaderLinksComponent {
  @Output() onDropdownToggle:EventEmitter<any> = new EventEmitter<any>();

  private startCheckOutsideClick: boolean = false;
  private user = null;
  showNotifications: boolean = false;
  notifications = [{link:"/search",datetime:"2017-07-18 10:11:42",username:"Diego Ruiz",text:"Made a Title change request in assistance listings"},
    {link:"/help",datetime:"2017-07-16 10:11:42",username:"John Doe",text:"Made an Archive change request in assistance listings"},
    {link:"/signin",datetime:"2017-07-15 10:11:42",username:"Sharon Lee",text:"Requests your assistance listing change approval"},
    {link:"/reports/overview",datetime:"2016-07-17 10:11:42",username:"Bob Joe",text:"Submitted a report"},];
  private states = {
    isSignedIn: false,
    menu: false
  };

  private store = {
    menu: [
      { text: 'Profile',  routerLink: '/profile' },
      { text: 'Sign Out', routerLink: '/signout' }
    ]
  };

  public showDropdown:boolean = true;

  public dropdownData:any = [
    {linkTitle:"Home", linkClass:"fa-home", linkId:"header-link-home", linkUrl:"/", pageInProgress:false},
    {linkTitle:"Reports", linkClass:"fa-area-chart", linkId:"header-link-reports", linkUrl:"/reports/overview", pageInProgress:true},
    {linkTitle:"Workspace", linkClass:"fa-table", linkId:"header-link-workspace", linkUrl:"/workspace", pageInProgress:false},
    {linkTitle:"Help", linkClass:"fa-info-circle", linkId:"header-link-help", linkUrl:"/help/overview", pageInProgress:false},
    {linkTitle:"Hierarchy", linkClass:"fa-sitemap", linkId:"header-link-hierarchy", linkUrl:"/federal-hierarchy", pageInProgress:false},
    {linkTitle:"Data Services", linkClass:"fa-file-text-o", linkId:"header-link-data-service", linkUrl:"/data-services", pageInPorgress:false},
    {linkTitle:"Users", linkClass:"fa-user-plus", linkId:"header-link-users", linkUrl:"/", pageInProgress:true},
    {linkTitle:"Profile", linkClass:"fa-user", linkId:"header-link-profile", linkUrl:"/profile",pageInProgress:false, loggedIn: true},
    {linkTitle:"Sign Out", linkClass:"fa-sign-out", linkId:"header-link-signout", linkUrl:"/signout",pageInProgress:false, loggedIn: true},
  ];

  public searchLink = false;
  public menuLink = false;

  constructor(private _router:Router, private api: IAMService) {
    this._router.events.subscribe((event: any) => {
      if (event.constructor.name === 'NavigationEnd') {
        this.checkSession();

        if (event.urlAfterRedirects.indexOf('/search') != -1 || event.urlAfterRedirects === "/") {
          setTimeout(() => {
            this.onSearchLinkClick(true);
          });
        } else {
          this.onSearchLinkClick(false);
        }
      }
    });
  }

  ngOnInit() {
    this.checkSession();
  }

  checkSession() {
    this.api.iam.checkSession(user => {
      this.states.isSignedIn = true;
      this.user = user;
    }, () => {
      this.states.isSignedIn = false;
      this.user = null;
    });
  }

  onSearchLinkClick(state:boolean=null){
    if (this.showDropdown === true && this.menuLink === true) {
      this.menuLink = false;
      this.searchLink = true;
    } else {
      let finalState = !this.searchLink;
      if(state!==null){
        finalState = state;
      }
      this.showDropdown = finalState;
      this.searchLink = this.showDropdown;
      this.menuLink = false;
    }
  }

  onMenuLinkClick() {
    if (this.showDropdown === true && this.searchLink === true) {
      this.searchLink = false;
      this.menuLink = true;
    } else {
      this.showDropdown = !this.menuLink;
      this.menuLink = this.showDropdown;
      this.searchLink = false;
    }
  }

  onMenuClick(){
    this.showDropdown = !this.showDropdown;
    this.onDropdownToggle.emit(this.showDropdown);
    setTimeout(()=>{
      this.startCheckOutsideClick = this.showDropdown;
    });
  }

  dropdownItemClick(item){
    this.closeDropdown();
    this.menuLink = false;
    this.searchLink = false;
    this._router.navigateByUrl(item.linkUrl);
  }

  closeDropdown(){
    this.showDropdown = false;
    this.onDropdownToggle.emit(this.showDropdown);
    setTimeout(()=>{
      this.startCheckOutsideClick = this.showDropdown;
    });
  }

  onClickOutside(){
    if (this.startCheckOutsideClick) {
      this.startCheckOutsideClick = false;
      this.closeDropdown();
    }
  }

  itemToggle(item){
    let returnVal = true;
    if(!globals.showOptional){
      if(item.hasOwnProperty('loggedIn')){
        returnVal = this.states.isSignedIn && item.loggedIn && !item.pageInProgress;
      } else {
        returnVal = !item.pageInProgress;
      }
    } else {
      if(item.hasOwnProperty('loggedIn')){
        returnVal = this.states.isSignedIn && item.loggedIn;
      }
    }
    return returnVal;
  }

  refreshPage(){
    window.location.reload();
  }
  startNotificationOutsideClick = false;
  notificationStartClick(){
    this.showNotifications = !this.showNotifications;
    setTimeout(()=>{
      this.startNotificationOutsideClick = this.showNotifications;
    });
  }

  onNotificationOutsideClick(){
    if(this.startNotificationOutsideClick){
      this.showNotifications = false;
      this.startNotificationOutsideClick = false;
    }
  }
}
