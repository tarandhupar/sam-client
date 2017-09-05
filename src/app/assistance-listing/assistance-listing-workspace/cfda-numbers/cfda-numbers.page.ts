import * as Cookies from 'js-cookie';
import {Component, OnInit, Input, ViewChild} from "@angular/core";
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {ProgramService} from 'api-kit';
import { IBreadcrumb } from "sam-ui-kit/types";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {FHService} from "../../../../api-kit/fh/fh.service";
import {OrganizationNamesPipe} from "../../pipes/organization-names.pipe";


@Component({
  providers: [FHService],
  templateUrl: 'cfda-numbers.template.html'
})

export class CfdaNumbersPage implements OnInit {
  private currentPage:number = 0;
  alerts = [];
  cookieValue: string;
  processedCfdaNumbers: any;
  public permissions: any;
  crumbs: Array<IBreadcrumb> = [
    { breadcrumb:'Home', url:'/',},
    { breadcrumb: 'Workspace', url: '/workspace' },
    { breadcrumb: 'CFDA Numbers'}
  ];
  cfdaNumbersApi: any;


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private programService: ProgramService,
              private fhService: FHService) {
  }

  ngOnInit(){
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');

    if (this.cookieValue === null || this.cookieValue === undefined) {
      this.router.navigate(['signin']);
    }

    if (SHOW_HIDE_RESTRICTED_PAGES !== 'true') {
      this.router.navigate(['accessrestricted']);
    }
    this.loadCfdaNumbers();

  }

  private loadCfdaNumbers(){
    let apiSubject = new ReplaySubject(1);
    this.programService.getFederalHierarchyConfigurations(this.cookieValue, this.currentPage).subscribe(apiSubject);
    apiSubject.subscribe(res => {
      this.cfdaNumbersApi = res;
        let organizationNamesPipe = new OrganizationNamesPipe(this.fhService);
      organizationNamesPipe.transform(this.cfdaNumbersApi._embedded.federalHierarchyConfigurationList).subscribe(result => {
          this.processedCfdaNumbers = result;
        });
    }, error => {
      let errorRes = error.json();
      if (error && error.status === 401) {
        this.alerts.push({
          type: 'error',
          title: 'Unauthorized',
          description: 'Insufficient privileges to get user permission.'
        });
      } else if (error && (error.status === 502 || error.status === 504)) {
        this.alerts.push({
          type: 'error',
          title: errorRes.error,
          description: errorRes.message
        });
      }
    });

    return apiSubject;
  }

  pageChangeHandler(event){
    this.currentPage = event-1;
    this.loadCfdaNumbers();
  }

  onEditClick(orgId){
    let url = '/fal/cfda-management/' + orgId + '/edit';
    this.router.navigateByUrl(url);
  }
}
