import { Component, Input, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FHService } from 'api-kit/fh/fh.service';
import * as moment from 'moment/moment';
import { FlashMsgService } from '../flash-msg-service/flash-message.service';
import { AlertFooterService } from '../../app-components/alert-footer/alert-footer.service';
import { OrgAddrFormComponent } from '../../app-components/address-form/address-form.component';
import { Observable } from 'rxjs';
import { FHTitleCasePipe } from '../../app-pipes/fhTitleCase.pipe';

@Component({
  templateUrl: 'profile.template.html'
})
export class OrgDetailProfilePage {
  @ViewChildren(OrgAddrFormComponent)
  addrForms: QueryList<OrgAddrFormComponent>;

  orgId: string = '';
  orgObj = {};
  orgDetails = [];
  orgCodes = [];
  orgAddresses = [];

  isDoD: boolean = false;
  canEdit: boolean = false;
  canCreate: boolean = false;
  createType: string = '';
  isEdit: boolean = false;
  showFullDes: boolean = false;
  showEditOrgFlashAlert: boolean = false;
  editedDescription: string = '';
  editedShortname: string = '';
  editedEndDate: string = '';

  editTypeMap = {
    'Dept/Ind Agency': 'Department',
    'Sub-Tier': 'AGENCY',
    Office: 'Office',
    'Maj Command': 'Major Command',
    'Sub-Command 1': 'Sub Command',
    'Sub-Command 2': 'Sub Command',
    'Sub-Command 3': 'Sub Command'
  };

  addrTypeMaping = {
    M: 'Mailing Address',
    B: 'Billing Address',
    S: 'Shipping Address'
  };

  constructor(
    private fhService: FHService,
    private fhTitleCasePipe: FHTitleCasePipe,
    private route: ActivatedRoute,
    private _router: Router,
    private alertFooter: AlertFooterService,
    public flashMsgService: FlashMsgService
  ) {}

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.orgId = params['orgId'];
      this.orgObj = this.route.parent.snapshot.data['org'];
      this.setupOrgFields(this.orgObj);
      this.isEdit = false;
    });
  }

  isEditableField(field): boolean {
    return ['Description', 'Shortname', 'End Date'].indexOf(field) !== -1;
  }

  isRequestAACIcon(pair): boolean {
    if (this.canEdit) {
      return (
        !this.isDoD &&
        pair.value === '' &&
        (pair.code === 'Procurement AAC' || pair.code === 'Non-procurement AAC')
      );
    }
    return false;
  }

  setupOrgFields(orgDetail) {
    this.isDoD = orgDetail.l1OrgKey === 100000000;

    this.setupOrganizationDetail(orgDetail);
    this.setupOrganizationCodes(orgDetail);
    this.setupOrganizationAddress(orgDetail);
    this.setupPermissions(orgDetail);
  }

  onCancelEditPageClick() {
    this.isEdit = false;
  }

  onSaveEditPageClick() {
    let endDateStr = this.orgObj['endDate']
      ? moment(this.orgObj['endDate']).format('Y-M-D')
      : '';
    let shortNameStr = this.orgObj['shortName'] ? this.orgObj['shortName'] : '';
    let summaryStr = this.orgObj['summary'] ? this.orgObj['summary'] : '';
    if (this.orgObj['type'].toLowerCase() === 'office') {
      let validateRes = this.addrForms.map(e => e.validateForm());
      Observable.forkJoin(validateRes).subscribe(
        results => {
          let isAddrValid =
            results.filter(e => {
              return e['description'] !== 'VALID';
            }).length === 0;
          if (isAddrValid) {
            this.isEdit = false;
            let updatedAddresses = this.getUpdatedOrgAddresses();
            if (
              this.orgObj['summary'] !== this.editedDescription ||
              this.orgObj['shortName'] !== this.editedShortname ||
              endDateStr !== this.editedEndDate ||
              JSON.stringify(updatedAddresses) !==
                JSON.stringify(this.orgObj['orgAddresses'])
            ) {
              let updatedOrgObj = JSON.parse(JSON.stringify(this.orgObj));
              updatedOrgObj['summary'] = this.editedDescription;
              updatedOrgObj['shortName'] = this.editedShortname;
              updatedOrgObj['endDate'] =
                this.editedEndDate === '' ? null : this.editedEndDate;
              updatedOrgObj['orgAddresses'] = updatedAddresses;
              this.updateOrganization(updatedOrgObj);
            }

          }
        },
        error => { this.showAlertFooter('error', 'Location Service Encountered Problem', 'Error'); }
      );
    } else {
      this.isEdit = false;
      if (
        summaryStr !== this.editedDescription ||
        shortNameStr !== this.editedShortname ||
        endDateStr !== this.editedEndDate
      ) {
        let updatedOrgObj = JSON.parse(JSON.stringify(this.orgObj));
        updatedOrgObj['summary'] = this.editedDescription;
        updatedOrgObj['shortName'] = this.editedShortname;
        updatedOrgObj['endDate'] =
          this.editedEndDate === '' ? null : this.editedEndDate;
        this.updateOrganization(updatedOrgObj);
      }
    }
  }


  updateOrganization(updatedOrgObj){
    this.fhService.updateOrganizationV2(updatedOrgObj).subscribe(
    val => {
       this.orgObj = updatedOrgObj;
       this.setupOrgFields(updatedOrgObj);
       this.showAlertFooter(
          'success',
          'Your edits have been saved',
          'Success'
        );
      },
      error => {
        this.showAlertFooter('error', 'Failed to update your edits', 'Error');
      }
    );
  }

  onEditPageClick() {
    this.isEdit = true;
  }

  onAACRequestClick(pair) {
    // Make API call to request for procurement or non-procurement AAC
    let isProcureAAC = pair['code'] === 'Procurement AAC';
    this.fhService.requestAAC(this.orgId, isProcureAAC).subscribe(
      data => {
        this.setupOrganizationCodes(data);
        let message = 'Non-procurement AAC has been requested';
        if (pair['code'] === 'Procurement AAC')
          message = 'Procurement AAC request has been completed';
        this.showAlertFooter(
          'success',
          'Successfully requested ' + pair['code'],
          'Success'
        );
      },
      error => {
        this.showAlertFooter('error', pair['code'] + ' request failed', '');
      }
    );
  }

  onAddAddressForm() {
    if (this.orgAddresses.length === 2) {
      let lastAddrType = '';
      if (this.orgAddresses[1].addrModel.addrType !== '') {
        lastAddrType =
          this.orgAddresses[1].addrModel.addrType === 'Shipping Address'
            ? 'Billing Address'
            : 'Shipping Address';
      }
      this.orgAddresses.push({
        addrModel: {
          addrType: lastAddrType,
          country: '',
          state: '',
          city: '',
          street1: '',
          street2: '',
          zip: ''
        },
        showAddIcon: false
      });
    } else if (this.orgAddresses.length < 2) {
      this.orgAddresses.push({
        addrModel: {
          addrType: '',
          country: '',
          state: '',
          city: '',
          street1: '',
          street2: '',
          zip: ''
        },
        showAddIcon: false
      });
    }
    this.orgAddresses.forEach(e => {
      e.showAddIcon = false;
    });
  }

  onEnableAddAddressIcon(val) {
    if (val) {
      this.orgAddresses.forEach(e => {
        e.showAddIcon = true;
      });
    }
  }

  onDeleteAddressForm(orgAddrModel) {
    this.orgAddresses = this.orgAddresses.filter(e => {
      return orgAddrModel.addrType !== e.addrModel.addrType;
    });
    this.orgAddresses.forEach(e => {
      e.showAddIcon = true;
    });
  }

  setupPermissions(org) {
    if (org._links) {
      this.canEdit =
        Object.keys(org._links).filter(e => {
          return e === 'UPDATE';
        }).length > 0;
      let createPermission = Object.keys(org._links).filter(e => {
        return e.includes('CREATE');
      });
      this.canCreate = createPermission.length > 0;
      if (this.canCreate) this.createType = createPermission[0].split('_')[1];
    }
  }

  setupOrganizationDetail(org) {
    this.orgDetails = [];
    let description = this.getOrgFieldData(org, 'summary');
    let shortName = this.getOrgFieldData(org, 'shortName');
    let startDateStr = org.startDate
      ? moment(org.startDate)
          .utc()
          .format('MM/DD/YYYY')
      : '';
    let endDateStr = org.endDate
      ? moment(org.endDate)
          .utc()
          .format('MM/DD/YYYY')
      : '';
    let funding = '';

    this.orgDetails.push({
      description: org.type + ' Name',
      value: this.fhTitleCasePipe.transform(org.name)
    });
    this.orgDetails.push({ description: 'Description', value: description });
    this.orgDetails.push({ description: 'Shortname', value: shortName });
    this.orgDetails.push({ description: 'Start Date', value: startDateStr });
    this.orgDetails.push({ description: 'End Date', value: endDateStr });

    this.editedDescription = description;
    this.editedShortname = shortName;
    this.editedEndDate = endDateStr;

    if (org.type.toLowerCase() === 'office') {
      let fundingStrs = [];
      if (org.newIsFunding) fundingStrs.push('Funding');
      if (org.newIsAward) fundingStrs.push('Award');
      if (fundingStrs.length > 1) funding = fundingStrs.join('/');
      this.orgDetails.push({ description: 'Indicate Funding', value: funding });
    }
  }

  setupOrganizationCodes(org) {
    this.orgCodes = [];
    switch (org.type) {
      case 'OFFICE':
      case 'Office':
        this.orgCodes.push({
          code: 'Procurement AAC',
          value: this.getOrgFieldData(org, 'procurementAACCode')
        });
        this.orgCodes.push({
          code: 'Non-procurement AAC',
          value: this.getOrgFieldData(org, 'nonProcurementAACCode')
        });
        this.orgCodes.push({
          code: 'FPDS Code',
          value: this.getOrgFieldData(org, 'fpdsCode')
        });
        break;
      case 'AGENCY':
      case 'Sub-Tier':
      case 'Maj Command':
      case 'Sub-Command 1':
      case 'Sub-Command 2':
      case 'Sub-Command 3':
        this.orgCodes.push({
          code: 'FPDS Code',
          value: this.getOrgFieldData(org, 'fpdsCode')
        });
        this.orgCodes.push({
          code: 'OMB Bureau Code',
          value: this.getOrgFieldData(org, 'ombAgencyCode')
        });
        break;
      case 'DEPARTMENT':
      case 'Dept/Ind Agency':
        this.orgCodes.push({
          code: 'TAS-2 Code',
          value: this.getOrgFieldData(org, 'tas2Code')
        });
        this.orgCodes.push({
          code: 'TAS-3 Code',
          value: this.getOrgFieldData(org, 'tas3Code')
        });
        this.orgCodes.push({
          code: 'A-11 Code',
          value: this.getOrgFieldData(org, 'a11TacCode')
        });
        this.orgCodes.push({
          code: 'CFDA Code',
          value: this.getOrgFieldData(org, 'cfdaCode')
        });
        this.orgCodes.push({
          code: 'OMB Bureau Code',
          value: this.getOrgFieldData(org, 'ombAgencyCode')
        });
        break;
      default:
        break;
    }
  }

  setupOrganizationAddress(org) {
    this.orgAddresses = [];
    let addresses = org.orgAddresses.length > 0 ? org.orgAddresses : [];
    addresses.forEach(e => {
      if (e.type) {
        this.orgAddresses.push({
          addrModel: {
            addrType: this.addrTypeMaping[e.type],
            country: e.countryCode,
            state: e.state,
            city: e.city,
            street1: e.streetAddress,
            street2: e.streetAddress2 ? e.streetAddress2 : '',
            zip: e.zipcode
          },
          showAddIcon: addresses.length < 3
        });
      }
    });
  }

  showAlertFooter(type, desc, title) {
    this.alertFooter.registerFooterAlert({
      title: title,
      description: desc,
      type: type,
      timer: 3200
    });
  }

  getOrgFieldData(data, fieldName: string) {
    let res = '';
    if (!!data[fieldName]) {
      res = data[fieldName];
    }

    if (
      res === '' &&
      data['nonProcAACRequestedDate'] &&
      fieldName === 'nonProcurementAACCode'
    ) {
      res = 'AAC has been requested';
    }
    return res;
  }

  getUpdatedOrgAddresses() {
    let updateAddresses = [];
    this.orgAddresses.forEach(e => {
      let isUpdated = false;
      let addrType = '';
      Object.keys(this.addrTypeMaping).forEach(key => {
        if (this.addrTypeMaping[key] === e.addrModel.addrType) addrType = key;
      });

      // Update existing address if the address type is matching
      this.orgObj['orgAddresses'].forEach(addr => {
        if (addr.type === addrType) {
          let updatedAddr = JSON.parse(JSON.stringify(addr));
          isUpdated = true;
          updatedAddr['city'] = e.addrModel.city;
          updatedAddr['countryCode'] = e.addrModel.country;
          updatedAddr['state'] = e.addrModel.state;
          updatedAddr['streetAddress'] = e.addrModel.street1;
          updatedAddr['streetAddress2'] = e.addrModel.street2;
          updatedAddr['zipcode'] = e.addrModel.zip;
          updateAddresses.push(updatedAddr);
        }
      });

      // Push a new address to the org address if there is no existing type of address in org
      if (!isUpdated) {
        updateAddresses.push({
          type: addrType,
          city: e.addrModel.city,
          countryCode: e.addrModel.country,
          state: e.addrModel.state,
          streetAddress: e.addrModel.street1,
          streetAddress2: e.addrModel.street2,
          zipcode: e.addrModel.zip
        });
      }
    });
    return updateAddresses;
  }

  onClickCreateOrg() {
    let type = this.createType;
    if (this.createType === 'Sub-Tier') type = 'Agency';
    let navigationExtras: NavigationExtras = {
      queryParams: { orgId: this.orgId, orgType: type }
    };
    this._router.navigate(['org/create'], navigationExtras);
  }

  dismissCreateOrgFlashAlert() {
    this.flashMsgService.hideFlashMsg();
    this.flashMsgService.resetFlags();
  }

  dismissEditOrgFlashAlert() {
    this.showEditOrgFlashAlert = false;
  }

  dismissMoveOrgFlashAlert() {
    this.flashMsgService.hideFlashMsg();
    this.flashMsgService.resetFlags();
  }

  dismissCreateOrgInfoAlert() {
    this.flashMsgService.resetFlags();
  }
}
