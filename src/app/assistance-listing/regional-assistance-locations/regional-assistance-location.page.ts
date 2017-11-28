import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {ProgramService} from 'api-kit';
import * as Cookies from 'js-cookie';
import { IBreadcrumb } from "sam-ui-elements/src/ui-kit/types";
import {FHService} from "../../../api-kit/fh/fh.service";
import {FALAuthGuard} from "../components/authguard/authguard.service";

@Component({
  moduleId: __filename,
  templateUrl: 'regional-assistance-location.template.html',
  providers: [
    ProgramService
  ]
})

export class FalRegionalAssistanceLocationsPage implements OnInit, OnDestroy {
  @ViewChild('autocomplete') autocomplete: any;

  keyword: string = '';
  index: string = '';
  all: boolean;
  includeCount: boolean;
  limit: number;
  organizationId: string = '';
  pageNum = 0;
  totalCount: any = 0;
  totalPages: any = 0;
  data = [];
  initLoad = true;
  oldKeyword: string = "";
  qParams: any = {};
  size: any = {};
  cookieValue: string;
  runProgSub: any;
  sortBy: string = "-modifiedDate";
  oFilterParam: {};
  optionsHalLink: boolean;
  orgMap = new Map();
  public permissions: any;
  raoExists: boolean = true;
  regionalLocationSearchConfig: any = {
    placeholder: "Search Regional Assistance Locations"
  };
  hasPermissions: boolean;
  public userPermissions: any;

  crumbs: Array<IBreadcrumb> = [
    { breadcrumb:'Home', url:'/',},
    { breadcrumb: 'Workspace', url: '/workspace' },
    { breadcrumb: 'Regional Assistance Locations'}
  ];


  constructor(private activatedRoute: ActivatedRoute, private router: Router, private programService: ProgramService, private fhService: FHService,
  private falAuthGuard: FALAuthGuard) {
  }

  ngOnInit() {
    this.getUserPermissions();
  }

  getUserPermissions() {
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');
    this.programService.getPermissions(this.cookieValue, 'ORG_ID, ORG_LEVELS').subscribe(res => {
      this.permissions = res;
    });
    this.userPermissions = this.falAuthGuard._falLinks;
    this.hasPermissions = this.falAuthGuard.checkPermissions('regAssLoc', null);
    if(this.hasPermissions) {
      //this.setupQS();
      this.activatedRoute.queryParams.subscribe(
        data => {
          this.keyword = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : this.keyword;
          this.pageNum = typeof data['page'] === "string" && parseInt(data['page']) - 1 >= 0 ? parseInt(data['page']) - 1 : this.pageNum;

          this.checkRAOExists();
          this.getRegionalAssistanceLocations();
        });
    }
  }

  ngOnDestroy() {

    if (this.runProgSub)
      this.runProgSub.unsubscribe();


  }

  setupQS() {
    let qsobj = {};
    if(this.keyword.length>0){
      qsobj['keyword'] = this.keyword;
    } else {
      qsobj['keyword'] = '';
    }
    if (this.pageNum >= 0) {
      qsobj['page'] = this.pageNum + 1;
    } else {
      qsobj['page'] = 1;
    }
    return qsobj;
  }

  checkRAOExists() {
    // make api call
    this.programService.getRegionalOffices({
      Cookie: this.cookieValue,
      keyword: ''
    }).subscribe(
      data => {
        this.raoExists = data.page['totalElements'] > 0;
      },
      error => {
        console.error('Error!!', error);
      }
    );
  }

  getRegionalAssistanceLocations() {
    // make api call
    this.runProgSub = this.programService.getRegionalOffices({
      Cookie: this.cookieValue,
      keyword: this.keyword,
      page: this.pageNum,
      sortBy: this.sortBy
    }).subscribe(
      data => {

        if (data._embedded && data._embedded.regionalOfficeList) {
          this.data = data._embedded.regionalOfficeList;
          this.totalCount = data.page['totalElements'];
          this.size = data.page['size'];
          this.totalPages = data.page['totalPages'];

        } else {
          this.totalCount = 0;
          this.data = [];
          this.totalPages = 0;
        }
        this.oldKeyword = this.keyword;
        this.initLoad = false;
        this.createOrgNameMap();
      },
      error => {
        console.error('Error!!', error);
      }
    );
    // construct qParams to pass parameters to object view pages
    this.qParams['keyword'] = this.keyword;
    this.qParams['index'] = this.index;
  }

  createOrgNameMap(){
    let idArray = new Set(this.data.map(data => {
      let id = data.organizationId;

      if(typeof id !== 'string'){
        return id.toString();
      }
      return id;
     }));
    let uniqueIdList = Array.from(idArray).join();
    let ctx = this;
    if(uniqueIdList && uniqueIdList.length > 0){
      this.fhService.getOrganizationsByIds(uniqueIdList)
        .subscribe(
          data => {
            data._embedded.orgs.forEach(function(org){
              ctx.orgMap.set(org.org.orgKey.toString(), org.org.name);
            });
            this.addOrgNameToData();
          },
          error => {
            console.error('Error!!', error);
          }
        );
    }

  }

  addOrgNameToData() {
    let ctx = this;
    ctx.data.forEach(function(data){
      data['title'] = ctx.orgMap.get(data.organizationId.toString());
    });
  }


  pageChange(pagenumber) {
    this.pageNum = pagenumber;
    let qsobj = this.setupQS();
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['fal/myRegionalAssistanceLocations/'], navigationExtras);
  }

  createNewLocation() {
    this.router.navigate(['fal/myRegionalAssistanceLocations/add']);
  }

  regionalLocationSearchModel(event) {
    if(event == null) {
      this.autocomplete.inputValue = "";
      this.keyword = "";
    } else {
      this.keyword = event;
    }
  }

  regionalLocationSearchClick() {
    this.pageNum = 0;
    let qsobj = this.setupQS();
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/fal/myRegionalAssistanceLocations/'], navigationExtras);
  }
}

