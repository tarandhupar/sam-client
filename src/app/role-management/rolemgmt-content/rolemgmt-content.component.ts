import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import * as moment from 'moment/moment';
import {FHService} from "../../../api-kit/fh/fh.service";
import {PropertyCollector} from "../../app-utils/property-collector";
import * as _ from 'lodash';
import {UserAccessService} from "../../../api-kit/access/access.service";

@Component({
  selector: 'rolemgmt-content',
  templateUrl: './rolemgmt-content.template.html'
})
export class RoleMgmtContent implements OnInit{

  @Input() requestDetails = '';
  @Input() count;
  @Input() currCount;
  @Input() totalPages;
  @Input() currPage;
  @Input() pendingCount;
  @Input() escalatedCount;

  @Output() sortOrder : EventEmitter<any> = new EventEmitter<any>();
  @Output() pageNumber : EventEmitter<any> = new EventEmitter<any>();
  Pagelimit : number;
  paginationConfig = {
      currentPage: 1,
  };
  pageNo = 1;

  selectModel = 'asc';
  selectConfig = {
    options: [
      {value: 'asc', label: 'Oldest First', name: 'sort-asc'},
      {value: 'desc', label: 'Newest First', name: 'sort-desc'},
    ]
  };

  organizationMap: any = {};
  roleMap: any = {};

  constructor(private fhService: FHService, private accessService: UserAccessService){

    this.Pagelimit = 10;

  }

  ngOnChanges(changeEvent) {
    if (changeEvent.requestDetails) {
      this.getOrganizationNames();
      this.getRoleNames();
    }
  }

  ngOnInit(){

  }

  private getOrganizationNames() {
    let pc: PropertyCollector = new PropertyCollector(this.requestDetails);

    // ids = ['1,2,3', '3,4,5']
    let allOrgIds: any = pc.collect([[], 'organizationId']);
    // ids = [[1,2,3],[3,4,5]]
    console.log(allOrgIds);
    allOrgIds = allOrgIds.map(commaSeperated => commaSeperated.split(','));
    // ids = [1, 2, 3, 3, 4, 5]
    allOrgIds = allOrgIds.reduce((accum, curr) => {
      return accum.concat(curr);
    }, []);
    // ids = "1,2,3,4,5"
    allOrgIds = _.uniq(allOrgIds);

    allOrgIds = allOrgIds.join(',');

    if (allOrgIds.length) {
      this.fhService.getOrganizations({orgKey: allOrgIds}).subscribe(res => {
        let orgs = res._embedded.orgs.map(o => o.org);
        this.organizationMap = _.keyBy(orgs, 'orgKey');
      });
    }
  }

  private getRoleNames() {
    this.accessService.getAllRoles().subscribe(res => {
      let roles = res._embedded.roleList;
      this.roleMap = _.keyBy(roles, 'id');
    });
  }

  roleNameForId(roleId) {
    if (!this.roleMap[roleId]) {
      return;
    }
    else {
      return this.roleMap[roleId].roleName;
    }
  }

  organizationNameForId(orgId) {
    if (!this.organizationMap[orgId]) {
      return;
    }
    else {
      return this.organizationMap[orgId].name;
    }
  }

  onSelectChanged(event){
    this.sortOrder.emit(event);
  }

  onPageChange(event){
    this.pageNo = event;
    this.pageNumber.emit(event);
    window.scrollTo(0,0);

  }

  formatDate(dateString) {
    if (dateString != '' && dateString != null) {
      return moment(dateString).format('MMM DD, YYYY');
    } else {
      return '--';
    }
  }

  classForRequest(request) {
    switch (request.status.val.toLowerCase()) {
      case 'pending': return 'fa-spinner pending-icon';
      case 'approved': return 'fa-check-circle-o approved-icon';
      case 'rejected': return 'fa-user-times rejected-icon';
      case 'escalated': return 'fa-exclamation-triangle escalated-icon';
    }
  }

  shouldShowRespondButton(content) {
    return content.status.val === 'PENDING' || content.status.val === 'ESCALATED';
  }

  showingCountText() {
    if (this.count === 0) {
      return 'Showing 0 results';
    }
    const first = (this.currPage - 1)* 10 + 1;
    const last = (this.currPage - 1)*10 + this.currCount;
    return `Showing ${first}-${last} of ${this.count} results`;
  }

  getRolesGranted(request) {
    return this.roleNameForId(request.roleId) || '---';
  }

  getOrganizations(request) {
    if (!request.organizationId || !request.organizationId.length) {
      return 'Organization not found';
    }
    const orgIds = request.organizationId.split(',');
    const names = orgIds.map(oid => {
      return this.organizationNameForId(oid);
    }).filter(oname => oname);
    return names.join(', ');
  }


  @Output() clickPendingRequestsCountEvent: EventEmitter<any> = new EventEmitter();
  onPendingClick() {
    this.clickPendingRequestsCountEvent.emit();
  }

  @Output() clickEscalatedRequestsCountEvent: EventEmitter<any> = new EventEmitter();
  onEscalatedClick() {
    this.clickEscalatedRequestsCountEvent.emit();
  }
}
