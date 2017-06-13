import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {ProgramService} from 'api-kit';
import * as Cookies from 'js-cookie';

@Component({
  moduleId: __filename,
  templateUrl: 'assistance-listing-workspace.template.html',
  providers: [
    ProgramService
  ]
})

export class FalWorkspacePage implements OnInit, OnDestroy {
  @ViewChild('autocomplete') autocomplete: any;

  keyword: string = '';
  index: string = '';
  organizationId: string = '';
  pageNum = 0;
  totalCount: any = 0;
  totalPages: any = 0;
  data = [];
  initLoad = true;
  oldKeyword: string = "";
  qParams: any = {};
  size: any = {};
  addFALButtonText: string = 'Add Assistance Listing';
  cookieValue: string;
  runProgSub: any;
  public permissions: any;
  workspaceSearchConfig: any = {
    placeholder: "Search Workspace"
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

    this.programService.getPermissions(this.cookieValue, 'FAL_LISTING, CREATE_FALS, FAL_REQUESTS').subscribe(res => {
      this.permissions = res;
      if (!this.permissions['FAL_LISTING']) {
        this.router.navigate['accessrestricted'];
      } else {
        //this.setupQS();
        this.activatedRoute.queryParams.subscribe(
          data => {
            this.keyword = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : this.keyword;
            this.pageNum = typeof data['page'] === "string" && parseInt(data['page']) - 1 >= 0 ? parseInt(data['page']) - 1 : this.pageNum;
            this.runProgram();
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

  runProgram() {
    // make api call
    this.runProgSub = this.programService.runProgram({
      keyword: this.keyword,
      pageNum: this.pageNum,
      Cookie: this.cookieValue

    }).subscribe(
      data => {

        if (data._embedded && data._embedded.program) {
          this.data = data._embedded.program;
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
    this.router.navigate(['fal/workspace/'], navigationExtras);
  }

  addBtnClick() {
    this.router.navigate(['programsForm/add']);
  }

  workspaceSearchModel(event) {
    if(event == null) {
      this.autocomplete.inputValue = "";
      this.keyword = "";
    } else {
      this.keyword = event;
    }
  }

  workspaceSearchClick() {
    this.pageNum = 0;
    let qsobj = this.setupQS();
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/fal/workspace/'], navigationExtras);
  }
}

