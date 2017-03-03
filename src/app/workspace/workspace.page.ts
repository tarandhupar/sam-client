import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {ProgramService} from 'api-kit';

@Component({
  moduleId: __filename,
  templateUrl: 'workspace.template.html',
  providers: [
    ProgramService
  ]
})

export class WorkspacePage implements OnInit {
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

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private programService: ProgramService) {
  }

  ngOnInit() {
    this.setupQS();
    this.activatedRoute.queryParams.subscribe(
      data => {
        this.pageNum = typeof data['page'] === "string" && parseInt(data['page']) - 1 >= 0 ? parseInt(data['page']) - 1 : this.pageNum;
        this.runProgram();
      });
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
    this.programService.runProgram({
      pageNum: this.pageNum
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
    this.router.navigate(['workspace/'], navigationExtras);
  }

  addBtnClick() {
    this.router.navigate(['programs/add']);
  }
}

