import {Component, OnInit, OnDestroy} from '@angular/core';
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
  keyword: string = '';
  index: string = '';
  organizationId: string = '';
  pageNum = 0;
  totalCount: any = 0;
  totalPages: any = 0;
  data = [];
  initLoad = true;
  qParams: any = {};
  size: any = {};
  addFALButtonText: string = 'Add Federal Assistance Listing';
  cookieValue: string;
  runProgSub: any;


  constructor(private activatedRoute: ActivatedRoute, private router: Router, private programService: ProgramService) {
  }

  ngOnInit() {
    if ( Cookies.get('iPlanetDirectoryPro') !== undefined) {
    this.setupQS();
    this.activatedRoute.queryParams.subscribe(
      data => {
        this.pageNum = typeof data['page'] === "string" && parseInt(data['page']) - 1 >= 0 ? parseInt(data['page']) - 1 : this.pageNum;
        this.cookieValue = Cookies.get('iPlanetDirectoryPro');
        this.runProgram();
      });
    } else if (Cookies.get('iPlanetDirectoryPro') === null || Cookies.get('iPlanetDirectoryPro') === undefined) {
      this.router.navigate(['signin']);
    }
  }
  ngOnDestroy(){

    if(this.runProgSub)
      this.runProgSub.unsubscribe();


  }
  setupQS() {
    let qsobj = {};
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
          this.data['program'] = null;
        }
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
    this.router.navigate(['falworkspace/'], navigationExtras);
  }

  addBtnClick() {
    this.router.navigate(['programs/add']);
  }
}

