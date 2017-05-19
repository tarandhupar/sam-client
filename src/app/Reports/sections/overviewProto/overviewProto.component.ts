import { Component, Input, Output, EventEmitter, NgZone, NgModule, OnInit, ViewChild, ViewChildren,
  AfterViewInit,  AfterViewChecked, Query, QueryList } from '@angular/core';
import { Http,  Response } from '@angular/http';
import { Router } from '@angular/router';
import { json } from 'json-loader!src/assets/dynamicReports.json';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { IAMService, ReportsService } from 'api-kit';
import { SamUIKitModule } from 'sam-ui-kit';
import { globals } from '../../app/globals';
import { FavoritePipe } from './favorite.pipe';
import * as _ from 'lodash';
import * as Cookies from 'js-cookie';

export const REPORTS_PER_PAGE: number = 10;

@Component({
  providers: [ IAMService, ReportsService ],
  templateUrl: './overviewProto.template.html',
})
export class OverviewProtoComponent implements OnInit, AfterViewInit {
  @ViewChildren('myVar') myVars: QueryList<'myVar'>;
  public states = {
    isSignedIn: false,
    showSignIn: true,
    isAdmin: false
  };
  public user = null;
  public userRoles = null;
  public dbReports = null;
  public currentReports = null;
  public liked = true;
  public favorite = false;
  public admin = false;
  data: {
    development: {
      admin: [string, Boolean, string, string, Boolean, string],
      user: [string, Boolean, string, string, Boolean, string]
    },
    test: {
      admin: [string, Boolean, string, string, Boolean, string],
      user: [string, Boolean, string, string, Boolean, string]
    },
    production: {
      admin: [string, Boolean, string, string, Boolean, string],
      user: [string, Boolean, string, string, Boolean, string]
    }
  };
  currentPage: number = 1;
  totalReportCount: number = 0;
  currentReportStartIndex: number = 0;
  currentReportEndIndex: number = 0;
  selectedIdx = null;
  errorMessage: string;
  item: any = [1, false];
  API_UMBRELLA_URL: string;
  mode = 'Observable';

  constructor ( private router: Router, private zone: NgZone, private reportsService: ReportsService,
                private api: IAMService, private http: Http ) {
    /*this.http.get('src/assets/dynamicMincReports.json')
     .map(res => res.json())
     .subscribe(data => {
     this.data = data;
     this.zone.runOutsideAngular(() => {
     this.checkSession(() => {
     this.zone.run(() => {
     // Callback
     });
     });
     });
     },
     err => console.log(err),
     () => console.log('Completed'));*/
  }

  ngAfterViewInit() {
    console.log(this.myVars.toArray().length);
  }

  selectItem(index): void {
    this.selectedIdx = index;
    this.liked = !this.liked;
  }

  addUser( id ) {

    this.reportsService.savePreference(id, this.data, Cookies.get('iPlanetDirectoryPro'))
      .subscribe(
        data => this.data = data,
        error => console.log(error),
        () => console.log('Completed')
      );
  }

  deleteUser(id) {
    this.reportsService.savePreference(id, this.data, Cookies.get('iPlanetDirectoryPro'))
      .subscribe(
        data => this.data = data,
        error => console.log(error),
        () => console.log('Completed')
      );
  }
  totalPages(): number {
    return Math.floor((this.totalReportCount) / REPORTS_PER_PAGE) + 1;
  }
  onParamChanged(page) {
    // if this is a page change, the page parameter is > 1
    if (page) {
      this.currentPage = page;
    } else {
      this.currentPage = 1;
    }
    this.getReports();
  }
  getReports() {
    let startIndex: number = (this.currentPage - 1) * REPORTS_PER_PAGE;
    let endIndex: number = startIndex + REPORTS_PER_PAGE;

    this.currentReportStartIndex = startIndex + 1;

    if (endIndex > this.totalReportCount) {
      this.currentReportEndIndex = this.totalReportCount;
    } else {
      this.currentReportEndIndex = endIndex;
    }

    this.currentReports = this.dbReports.slice(startIndex, endIndex);
  }
  ngOnInit() {
    this.http.get('src/assets/dynamicMincReports.json')
      .map(res => res.json())
      .subscribe(data => {
          this.data = data;
          this.zone.runOutsideAngular(() => {
            this.checkSession(() => {
              this.zone.run(() => {
                // Callback
              });
            });
          });
        },
        err => console.log(err),
        () => console.log('Completed'));
  }

  checkSession( cb: () => void ) {
    let vm = this;

    this.api.iam.user.get(function(user) {
      vm.states.isSignedIn = true;
      vm.states.showSignIn = false;
      vm.userRoles = user.gsaRAC;

      let isReportsUser = false;
      let isReportsAdmin = false;

      for (let _i = 0; _i < vm.userRoles.length; _i++) {
        if (vm.userRoles[_i].role.indexOf('GSA_REPORT_R') >= 0) {
          isReportsUser = true;
        }

        if (vm.userRoles[_i].role.indexOf('ADMIN') >= 0) {
          isReportsAdmin = true;
        }

        if (isReportsUser && isReportsAdmin) {
          // User is an Admin user
          vm.states.isAdmin = true;
          vm.admin = vm.states.isAdmin;
        }
      }
      vm.user = user;
      if ( ENV === 'development') {
        if (vm.admin) {
          vm.dbReports = vm.data.development.admin;
        } else {
          vm.dbReports = vm.data.development.user;
        }
        /*else if (ENV === 'test') {
         if (vm.admin) {
         vm.dbReports = vm.data.test.admin;
         } else {
         vm.dbReports = vm.data.test.user;
         }
         } else if ( ENV === 'production') {
         if (vm.admin) {
         vm.dbReports = vm.data.production.admin;
         } else {
         vm.dbReports = vm.data.production.user;
         }
         }*/
      } else if (_.includes(API_UMBRELLA_URL, 'comp')) {
        if (vm.admin) {
          vm.dbReports = vm.data.development.admin;
        } else {
          vm.dbReports = vm.data.development.user;
        }
      } else if (_.includes(API_UMBRELLA_URL, 'minc')) {
        if (vm.admin) {
          vm.dbReports = vm.data.test.admin;
        } else {
          vm.dbReports = vm.data.test.user;
        }
      } else if (_.includes(API_UMBRELLA_URL, 'prodlike')) {
        if (vm.admin) {
          vm.dbReports = vm.data.production.admin;
        } else {
          vm.dbReports = vm.data.production.user;
        }
      } else if (_.includes(API_UMBRELLA_URL, 'prod')) {
        if (vm.admin) {
          vm.dbReports = vm.data.production.admin;
        } else {
          vm.dbReports = vm.data.production.user;
        }
      }
      vm.totalReportCount = vm.dbReports.length;
      let sortedArray = vm.dbReports.slice(0);
      sortedArray.sort((first, second): number => {
        if (first.name < second.name) return -1;
        if (first.name > second.name) return 1;
        return 0;
      });
      vm.dbReports = sortedArray;
      vm.getReports();
      cb();
    });
  }
}
