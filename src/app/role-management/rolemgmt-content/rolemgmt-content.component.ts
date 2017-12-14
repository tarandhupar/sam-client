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

  selectModel = {type: 'requested-date', sort: 'asc' };
  selectConfig = {
    options: [
      {value: 'requested-date', label: 'Requested Date', name: 'requested-date'}
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
    this.sortOrder.emit(event.sort);
  }

  onPageChange(event){
    this.pageNumber.emit(event);
    window.scrollTo(0,0);

  }

  formatDate(dateString) {
    if (dateString != '' && dateString != null) {
      return moment(dateString.split(' ')[0]).format('MMM DD, YYYY');
    } else {
      return '--';
    }
  }

  shouldShowRespondButton(content) {
    return content._links && content._links.respond_request;
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
