import { Component, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { globals } from '../../globals.ts';

import { IAMService } from 'api-kit';
import { LoginService } from '../login/login.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface HeaderLink {
  linkTitle: string;
  linkClass: string;
  linkId: string;
  linkUrl: string;
  pageInProgress: boolean;
  loggedIn?: boolean;
}

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

  private requestLimit:number = 5;
  private notificationLimit:number = 5;

  private startCheckOutsideClick: boolean = false;
  private user = null;
  private states = {
    isSignedIn: false,
  };

  public dropdowns: { [key:string]: HeaderLink[] } = {
    menu: [
      {linkTitle:"Home", linkClass:"fa-home", linkId:"header-link-home", linkUrl:"/", pageInProgress:false},
      {linkTitle:"Reports", linkClass:"fa-area-chart", linkId:"header-link-reports", linkUrl:"/reports/overview", pageInProgress:false},
      {linkTitle:"Workspace", linkClass:"fa-table", linkId:"header-link-workspace", linkUrl:"/workspace", pageInProgress:false},
      {linkTitle:"Data Services", linkClass:"fa-file-text-o", linkId:"header-link-data-service", linkUrl:"/data-services", pageInProgress:false},
      {linkTitle:"Users", linkClass:"fa-user-plus", linkId:"header-link-users", linkUrl:"/", pageInProgress:true},
      {linkTitle:"Help", linkClass:"fa-info-circle", linkId:"header-link-help", linkUrl:"/help/overview", pageInProgress:false},
    ],

    profile: [
      {linkTitle:"Profile", linkClass:"fa-user-circle", linkId:"header-link-profile", linkUrl:"/profile", pageInProgress:false,loggedIn: true},
      {linkTitle:"Sign Out", linkClass:"fa-sign-out", linkId:"header-link-signout", linkUrl:"/signout", pageInProgress:false,loggedIn: true},
    ]
  };

  public links = {
    menu: false,
    search: false,
    profile: false,
    login: false,
  };

  public showDropdown:boolean = true;
  public startNotificationOutsideClick = false;
  public showNotifications: boolean = false;
  public notifications = [
    {link:"/search",datetime:"2017-07-18 10:11:42",username:"Alert title",text:"This is a new alert"},
    {link:"/help",datetime:"2017-07-16 10:11:42",username:"Alert title",text:"This is a new alert"},
    {link:"/signin",datetime:"2017-07-15 10:11:42",username:"Alert title",text:"New Alert description testing"},
    {link:"/reports/overview",datetime:"2016-07-17 10:11:42",username:"Alert title",text:"New Alert description testing"},
    {link:"/reports/overview",datetime:"2016-07-17 10:11:42",username:"Alert title",text:"New Alert description testing"},
  ];

  public startRequestOutsideClick = false;
  public showRequests: boolean = false;
  public requests = [
    {link:"/search",datetime:"2017-07-18 10:11:42",username:"Diego Ruiz",text:"Made a Title change request in assistance listings"},
    {link:"/help",datetime:"2017-07-16 10:11:42",username:"John Doe",text:"Made an Archive change request in assistance listings"},
    {link:"/signin",datetime:"2017-07-15 10:11:42",username:"Sharon Lee",text:"Requests your assistance listing change approval"},
    {link:"/reports/overview",datetime:"2016-07-17 10:11:42",username:"Bob Joe",text:"Submitted a report"},
    {link:"/reports/overview",datetime:"2016-07-17 10:11:42",username:"Bob Joe",text:"Submitted a report"},
  ];

  constructor(private route: ActivatedRoute, private _router:Router, private api: IAMService, private loginService: LoginService) {
    this._router.events.subscribe((event: any) => {
      if (event.constructor.name === 'NavigationEnd') {
        this.checkSession();

        if (event.urlAfterRedirects.indexOf('/search') != -1 || event.urlAfterRedirects === "/") {
          setTimeout(() => {
            this.onLinkClick('search', true);
          });
        } else {
          this.onLinkClick('search', false);
        }
      }
    });

    this.route.queryParams.subscribe(queryParams => {
      if(queryParams['refresh']) {
        this.checkSession();
      }
    });
  }

  ngOnInit() {
    this.checkSession();
    this.loginService.loginEvent$.subscribe(() => {this.onLinkClick("login")})

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

  resetHeader() {
    let key;

    this.showDropdown = false;

    for(key in this.links) {
      this.links[key] = false;
    }
  }

  onLinkClick(key:string = null, state:boolean = null) {
    let active = !(key && this.links[key]) ? !this.links[key] : null;

    // Toggle Override
    if(state !== null) {
      active = state;
    }

    this.resetHeader();

    // Specific Actions
    switch(key) {
      case 'menu':
        break;
      case 'search':
        break;
      case 'profile':
        break;
      case 'login':
        break;
    }

    if(active !== null) {
      this.showDropdown = active;
      this.links[key] = active;
    }
  }

  onDropdownItemClick(item: HeaderLink) {
    this.closeDropdown();
    this.links.menu = false;
    this.links.search = false;
    this._router.navigateByUrl(item.linkUrl);
  }

  closeDropdown() {
    this.showDropdown = false;
    this.onDropdownToggle.emit(this.showDropdown);
    setTimeout(() => {
      this.startCheckOutsideClick = this.showDropdown;
    });
  }

  onClickOutside() {
    if (this.startCheckOutsideClick) {
      this.startCheckOutsideClick = false;
      this.closeDropdown();
    }
  }

  itemToggle(item) {
    let returnVal = true;

    if(!globals.showOptional) {
      if(item.hasOwnProperty('loggedIn')) {
        returnVal = this.states.isSignedIn && item.loggedIn && !item.pageInProgress;
      } else {
        returnVal = !item.pageInProgress;
      }
    } else {
      if(item.hasOwnProperty('loggedIn')) {
        returnVal = this.states.isSignedIn && item.loggedIn;
      }
    }

    return returnVal;
  }

  refreshPage() {
    window.location.reload();
  }

  notificationStartClick() {
    this.showNotifications = !this.showNotifications;
    if(this.showNotifications) {
      this.showDropdown = false;
      Object.keys(this.links).forEach(key => this.links[key] = false);
    }
    setTimeout(() => {
      this.startNotificationOutsideClick = this.showNotifications;
    });
  }

  onNotificationOutsideClick() {
    if(this.startNotificationOutsideClick) {
      this.showNotifications = false;
      this.startNotificationOutsideClick = false;
    }
  }

  requestStartClick() {
    this.showRequests = !this.showRequests;
    if(this.showRequests) {
      this.showDropdown = false;
      Object.keys(this.links).forEach(key => this.links[key] = false);
    }
    setTimeout(() => {
      this.startRequestOutsideClick = this.showRequests;
    });
  }

  onRequestOutsideClick() {
    if(this.startRequestOutsideClick) {
      this.showRequests = false;
      this.startRequestOutsideClick = false;
    }
  }
}
