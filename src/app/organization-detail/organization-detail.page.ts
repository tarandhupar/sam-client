import { Component } from '@angular/core';
import { FHService } from 'api-kit/fh/fh.service';
import { ActivatedRoute, Router, NavigationCancel } from '@angular/router';
import { FlashMsgService } from './flash-msg-service/flash-message.service';
import { Location } from '@angular/common';
import { CapitalizePipe } from '../app-pipes/capitalize.pipe';
import { IBreadcrumb } from 'sam-ui-elements/src/ui-kit/types';
import * as moment from 'moment/moment';

@Component({
  templateUrl: 'organization-detail.template.html'
})
export class OrgDetailPage {
  org: any;
  orgName: string = '';
  orgId: string = '';
  orgType: string = '';
  deptLogo: any = { href: 'src/assets/img/logo-not-found.png' };
  level;
  currentSection: string = 'Profile';

  orgStatusCbxModel: any = ['allactive'];
  orgStatusCbxConfig = {
    options: [
      { value: 'allactive', label: 'Active', name: 'Active' },
      { value: 'inactive', label: 'Inactive', name: 'Inactive' }
    ],
    name: 'organization status',
    label: ''
  };

  currentUrl: string = '';
  baseUrl: string = '/org/detail/';
  orgKeyLength = 9;
  private crumbs: Array<IBreadcrumb> = [];

  constructor(
    private fhService: FHService,
    private route: ActivatedRoute,
    private _router: Router,
    public flashMsgService: FlashMsgService,
    private location: Location,
    private capitalize: CapitalizePipe
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let val = { url: this.route.snapshot._routerState.url };

      this.org = this.route.snapshot.data['org'];
      //console.log(org);

      this.orgId = params['orgId'];
      this.orgName = this.org.name;
      this.orgType = this.org.type;
      this.level = this.org.level;
      this.setupCrumbs(this.org.fullParentPath,this.org.fullParentPathName);
      this.setDeptLogo();
      this.setUrlSection(val);
    });
  }

  setUrlSection(val) {
    this.currentUrl =
      val.url.indexOf('#') > 0
        ? val.url.substr(0, val.url.indexOf('#'))
        : val.url;
    this.currentUrl =
      this.currentUrl.indexOf('?') > 0
        ? this.currentUrl.substr(0, this.currentUrl.indexOf('?'))
        : this.currentUrl;
    let section = this.currentUrl.substr(
      this.baseUrl.length + this.orgKeyLength + 1
    );
    section = section.length === 0 ? 'profile' : section;
    this.currentSection = section;
  }

  getSectionClass(sectionValue) {
    return this.currentSection === sectionValue ? 'usa-current' : '';
  }

  selectCurrentSection(sectionValue) {
    this.currentSection = sectionValue;
  }

  setDeptLogo() {
    this.fhService.getOrganizationLogo(
      this.fhService.getOrganizationById(this.orgId, false),
      res => {
        if (res != null) this.deptLogo = { href: res.logo };
      },
      err => {}
    );
  }

  updateNoLogoUrl() {
    this.deptLogo = { href: 'src/assets/img/logo-not-found.png' };
  }

  isMoveOffice() {
    let canMove = false;
    if(this.org._links){
      canMove =
        Object.keys(this.org._links).filter(e => {
          return e === 'TRANSFER';
        }).length > 0;
    }
    
    //console.log(moment(this.org.endDate).format('MM-DD-YYYY').isBefore(moment(moment().toDate()).format('MM-DD-YYYY')));
    return canMove;
  }

  setupCrumbs(fullParentPath: string, fullParentPathName: string) {
    this.crumbs = [];
    let parentOrgNames = fullParentPathName.split('.').map(e => {
      return this.capitalize.transform(e.split('_').join(' '));
    });
    let parentOrgIds = fullParentPath.split('.');
    parentOrgIds.forEach((e, i) => {
      if (e !== this.orgId) {
        this.crumbs.push({
          url: '/org/detail/' + e,
          breadcrumb: parentOrgNames[i]
        });
      } else {
        this.crumbs.push({ breadcrumb: parentOrgNames[i] });
      }
    });
  }

  orgHierarchyStatusChange(val) {
    this.orgStatusCbxModel = val;
    this.flashMsgService.setHierarchyStatus(val);
  }
}
