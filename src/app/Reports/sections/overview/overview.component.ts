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
import * as Cookie from 'js-cookie';
import { Report } from '../../report';
import * as base64 from 'base-64';
import { LoginService } from '../../../../app/app-components/login/login.service';

export const REPORTS_PER_PAGE: number = 10;

@Component({
  providers: [ IAMService, ReportsService ],
  templateUrl: './overview.template.html',
})
export class OverviewComponent implements OnInit, AfterViewInit {
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
  data = {
    reports: []
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
  reports;
  completedReports = [];
  roleData;
  userRoleObject;
  userRole;
  mstrEnv;
  mstrServer;

  constructor ( private router: Router, private zone: NgZone, private reportsService: ReportsService,
                private api: IAMService, private http: Http, private loginService: LoginService ) {}

  ngAfterViewInit() {
  }

  selectItem(index): void {
    this.selectedIdx = index;
    this.liked = !this.liked;
  }

  addUser( id ) {
    this.reportsService.savePreference(id, this.data, Cookie.get('iPlanetDirectoryPro'))
      .subscribe(
        data => this.data = data,
        error => console.log(error)
      );
  }

  deleteUser(id) {
    this.reportsService.savePreference(id, this.data, Cookie.get('iPlanetDirectoryPro'))
      .subscribe(
        data => this.data = data,
        error => console.log(error)
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
    if (API_UMBRELLA_URL && (API_UMBRELLA_URL.indexOf("/prod") != -1 || API_UMBRELLA_URL.indexOf("/prodlike") != -1 || API_UMBRELLA_URL.indexOf("alpha") != -1)) {
      this.mstrEnv = 'stg';
      this.mstrServer = 'MICROSTRATEGY-4_BI.PROD-LDE.BSP.GSA.GOV';
    } else if (API_UMBRELLA_URL && API_UMBRELLA_URL.indexOf("/minc") != -1) {
      this.mstrEnv = 'test';
      this.mstrServer = 'MICROSTRATEGY-2_BI.PROD-LDE.BSP.GSA.GOV';
    } else if (API_UMBRELLA_URL && API_UMBRELLA_URL.indexOf("/comp") != -1) {
      this.mstrEnv = 'dev';
      this.mstrServer = 'MICROSTRATEGY-3_BI.PROD-LDE.BSP.GSA.GOV';
    } else if (API_UMBRELLA_URL && API_UMBRELLA_URL.indexOf("reisys") != -1) {
      this.mstrEnv = 'dev';
      this.mstrServer = 'MICROSTRATEGY-3_BI.PROD-LDE.BSP.GSA.GOV';
    }
    this.http.get('src/assets/report-configs/'+this.mstrEnv+'-reports.json')
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
          err => console.log(err));
    // this.reportsService.getUserRole(Cookie.get('iPlanetDirectoryPro')).subscribe(
    //     data => {
    //       this.roleData = data;
    //       let encodedToken = this.roleData.token.split(".");
    //       this.userRoleObject = JSON.parse(base64.decode(encodedToken[1]));
    //       this.userRole = this.userRoleObject.domainMapContent[0].roleMapContent[0].role.val;
    //     },
    //     error => console.log(error)
    //   );  
  }

  checkSession( cb: () => void ) {
    let vm = this;
    let completedReports = [];
    this.api.iam.user.get(function(user) {
      vm.states.isSignedIn = true;
      vm.states.showSignIn = false;
      let isReportsUser = true; // change to false after RM added
      let isReportsAdmin = true;
      vm.states.isAdmin = true;
      vm.admin = vm.states.isAdmin;
      vm.user = user;
      vm.dbReports = vm.data.reports;

      let sortedArray = vm.dbReports.slice(0);
      sortedArray.sort((first, second): number => {
        if (first.name < second.name) return -1;
        if (first.name > second.name) return 1;
        return 0;
      });
      for (let report of sortedArray) {
        if (report.complete) {
          completedReports.push(report);
        }
      }
      vm.dbReports = completedReports;
      vm.totalReportCount = completedReports.length;
      vm.getReports();
      
      cb();
    });
  }
  
  directToLogin() {
    this.loginService.triggerLogin();
  }
}