import { Component, Output, EventEmitter, NgZone } from '@angular/core';
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
    ])
  ]
})
export class SamHeaderLinksComponent {
  @Output() onDropdownToggle:EventEmitter<any> = new EventEmitter<any>();

  private startCheckOutsideClick: boolean = false;
  private user = null;

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

  showDropdown:boolean = true;
  dropdownData:any = [
    {linkTitle:"Home", linkClass:"fa-home", linkUrl:"/", pageInProgress:false},
    {linkTitle:"Reports", linkClass:"fa-area-chart", linkUrl:"/reports/overview", pageInProgress:true},
    {linkTitle:"Workspace", linkClass:"fa-table", linkUrl:"/workspace", pageInProgress:true},
    {linkTitle:"Help", linkClass:"fa-info-circle", linkUrl:"/help/overview", pageInProgress:false},
    {linkTitle:"Hierarchy", linkClass:"fa-sitemap", linkUrl:"/create-organization?orgType=Department", pageInProgress:true},
    {linkTitle:"Users", linkClass:"fa-user-plus", linkUrl:"/", pageInProgress:true},
    {linkTitle:"Profile", linkClass:"fa-user", linkUrl:"/profile",pageInProgress:false, loggedIn: true},
    {linkTitle:"Sign Out", linkClass:"fa-sign-out", linkUrl:"/signout",pageInProgress:false, loggedIn: true},
  ];

  constructor(private _router:Router, private zone: NgZone, private api: IAMService) {
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
    this.zone.runOutsideAngular(() => {
      this.api.iam.checkSession((user) => {
        this.zone.run(() => {
          this.states.isSignedIn = true;
          this.user = user;
        });
      },()=>{
        this.states.isSignedIn = false;
        this.user = null;
      });
    });
  }

  searchLink = false;
  menuLink = false;

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

}
