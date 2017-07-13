import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {ProgramService} from 'api-kit';
import * as Cookies from 'js-cookie';

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
  sortBy: string = "";
  oFilterParam: {};
  optionsHalLink: boolean;
  public permissions: any;
  raoExists: boolean = true;
  regionalLocationSearchConfig: any = {
    placeholder: "Search Regional Assistance Locations"
  };


  constructor(private activatedRoute: ActivatedRoute, private router: Router, private programService: ProgramService) {
  }

  ngOnInit() {
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');

    if (this.cookieValue === null || this.cookieValue === undefined) {
      this.router.navigate(['signin']);
    }

    if (SHOW_HIDE_RESTRICTED_PAGES !== 'true') {
      this.router.navigate(['accessrestricted']);
    }

    this.programService.getPermissions(this.cookieValue, 'FAL_LISTING, CREATE_FALS, CREATE_RAO, ORG_ID').subscribe(res => {
      this.permissions = res;
      if (!this.permissions['CREATE_RAO']) {
        this.router.navigate(['accessrestricted']);
      } else {
        //this.setupQS();
        this.activatedRoute.queryParams.subscribe(
          data => {
            this.keyword = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : this.keyword;
            this.pageNum = typeof data['page'] === "string" && parseInt(data['page']) - 1 >= 0 ? parseInt(data['page']) - 1 : this.pageNum;

            this.checkRAOExists();
            this.getRegionalAssistanceLocations();
          });
      }
    });
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
        }
        this.oldKeyword = this.keyword;
        this.initLoad = false;
      },
      error => {
        console.error('Error!!', error);
      }
    );
    // construct qParams to pass parameters to object view pages
    this.qParams['keyword'] = this.keyword;
    this.qParams['index'] = this.index;
  }


  pageChange(pagenumber) {
    this.pageNum = pagenumber;
    let qsobj = this.setupQS();
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['fal/myRegionalOffices/'], navigationExtras);
  }

  createNewLocation() {
    this.router.navigate(['fal/myRegionalOffices/add']);
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
    this.router.navigate(['/fal/myRegionalOffices/'], navigationExtras);
  }
}

