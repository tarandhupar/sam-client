import {
  Component,
  Input,
  Output,
  ViewChild,
  ViewChildren,
  QueryList,
  EventEmitter
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  FormControl
} from '@angular/forms';
import { SamTextComponent } from 'sam-ui-elements/src/ui-kit/form-controls/text/text.component';
import { OrgAddrFormComponent } from '../../app-components/address-form/address-form.component';
import { LabelWrapper } from 'sam-ui-elements/src/ui-kit/wrappers/label-wrapper/label-wrapper.component';
import { FHService } from '../../../api-kit/fh/fh.service';
import { FHTitleCasePipe } from '../../app-pipes/fhTitleCase.pipe';
import { FlashMsgService } from '../flash-msg-service/flash-message.service';
import { AlertFooterService } from '../../app-components/alert-footer/alert-footer.service';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import * as moment from 'moment/moment';

function validDateTime(c: FormControl) {
  let invalidError = { message: 'Date is invalid' };

  if (c.value === 'Invalid Date') {
    return invalidError;
  }
}

function isRequired(c: FormControl) {
  if (c.value === '') return { required: true };
}

@Component({
  selector: 'create-org-form',
  templateUrl: 'create-org-form.template.html'
})
export class OrgCreateForm {
  @ViewChildren(OrgAddrFormComponent)
  addrForms: QueryList<OrgAddrFormComponent>;

  @ViewChild('orgName') orgName: SamTextComponent;
  @ViewChild('orgStartDateWrapper') orgStartDateWrapper: LabelWrapper;
  @ViewChild('orgEndDateWrapper') orgEndDateWrapper: LabelWrapper;

  @Input() orgFormConfig: any;
  @Output() onCancelClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onReviewClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditClick: EventEmitter<any> = new EventEmitter<any>();

  // Indicate Funding radio group
  indicateFundRadioModel: any = '';
  indicateFundRadioConfig = {
    options: [
      {
        value: 'Funding/Awarding',
        label: 'Funding/Awarding',
        name: 'Funding/Awarding'
      },
      { value: 'Funding', label: 'Funding', name: 'Funding' },
      { value: 'Other', label: 'Other', name: 'Other' }
    ],
    name: 'indicate-funding',
    label: 'Indicate Funding',
    errorMessage: ''
  };

  basicInfoForm: FormGroup;
  officeCodesForm: FormGroup;
  agencyCodesForm: FormGroup;
  deptCodesForm: FormGroup;

  orgInfo: any = [];
  orgCodeInfo: any = [];
  orgObj: any = {};
  orgAddresses: any = [];
  orgType: string = '';
  orgParentId: string = '';
  fullParentPath: string = '';
  fullParentPathName: string = '';
  startDateInitVal: string = '';
  endDateInitVal: string = '';
  parentName: string = '';
  parentOrg: any = {};

  reviewOrgPage: boolean = false;
  createOrgPage: boolean = true;
  section = 'create';

  locationConfig = {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    }
  };

  extraAddressTypes = ['Billing Address', 'Shipping Address'];
  addrTypeMaping = {
    M: 'Mailing Address',
    B: 'Billing Address',
    S: 'Shipping Address'
  };
  orgTypeWithAddress = 'office';
  showFullDes: boolean = false;

  orgTypeMap = {
    department: 'Department/Ind Agency',
    agency: 'Sub-Tier Agency',
    office: 'Office',
  };

  orgTypeCreateMap = {
    department: 'Dept/Ind Agency',
    agency: 'Sub-Tier',
    office: 'Office',
  };

  detailHint: string = 'Please provide details required to create a department/Ind. Agency';
  title: string = '';

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private fhService: FHService,
    public flashMsgService: FlashMsgService,
    private fhTitleCasePipe: FHTitleCasePipe,
    private alertFooter: AlertFooterService
  ) {}

  ngOnInit() {
    this.basicInfoForm = this.builder.group({
      orgName: ['', []],
      orgStartDate: ['', [validDateTime, isRequired]],
      orgEndDate: ['', [validDateTime]],
      orgDescription: ['', []],
      orgShortName: ['', []]
    });

    if (this.orgFormConfig.mode === 'create') {
      this.orgAddresses.push({
        addrModel: {
          addrType: 'Mailing Address',
          country: '',
          state: '',
          city: '',
          street1: '',
          street2: '',
          zip: ''
        },
        showAddIcon: true
      });
      this.orgType = this.orgFormConfig.orgType.toLowerCase();
      this.orgParentId = this.orgFormConfig.parentId;
      this.setupOrgForms(this.orgType);
      this.updatePageText();
      if (!!this.orgParentId) this.setOrgDetail(this.orgFormConfig.parentOrg);
    } else {
      //console.log(this.orgFormConfig.org);
      delete this.orgFormConfig.org['endDate'];
      this.orgType = this.orgFormConfig.org.type
        .split(' ')
        .join('')
        .toLowerCase();
      this.setupOrgForms(this.orgType);
      this.populateOrgBasicForm(
        this.orgFormConfig.org,
        this.orgFormConfig.startDate
      );
      this.populateOrgForms(this.orgFormConfig.org);
      this.orgParentId = this.orgFormConfig.parentId;
      if (!!this.orgParentId) this.setOrgDetail(this.orgFormConfig.parentId);

      if (this.orgFormConfig.org.orgAddresses.length > 0) {
        this.orgFormConfig.org.orgAddresses.forEach(e => {
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
              showAddIcon: false
            });
          }
        });
        if (this.orgAddresses.length < 3)
          this.orgAddresses[this.orgAddresses.length - 1].showAddIcon = true;
      } else {
        this.orgAddresses.push({
          addrModel: {
            addrType: 'Mailing Address',
            country: '',
            state: '',
            city: '',
            street1: '',
            street2: '',
            zip: ''
          },
          showAddIcon: true
        });
      }
    }
  }

  isCreateMode(): boolean {
    return this.orgFormConfig.mode === 'create';
  }

  setOrgDetail(orgDetail) {
    this.fullParentPath = orgDetail.fullParentPath;
    this.fullParentPathName = orgDetail.fullParentPathName;
    this.parentName = orgDetail.name;
    this.parentOrg = orgDetail;
  }

  updatePageText(){
    let typeText = this.orgTypeMap[this.orgType.toLowerCase()];
    if (this.section === 'create') {
      this.title = 'Create ' + typeText;
      this.detailHint = 'Please provide details required to create a ' + typeText;
    } else {
      this.title = 'Create ' + typeText + ' Confirmation';
      this.detailHint = 'Confirm below details';
    }
  }

  // Set up organization specific forms according to the org type
  setupOrgForms(orgType) {
    switch (orgType.toLowerCase()) {
      case 'office':
        this.officeCodesForm = this.builder.group({
          FPDSCode: ['', []]
        });
        break;
      case 'agency':
      case 'majorcommand':
      case 'subcommand':
        this.agencyCodesForm = this.builder.group({
          FPDSCode: ['', []],
          OMBBureauCode: ['', []]
        });
        break;
      case 'department':
        this.deptCodesForm = this.builder.group({
          FPDSCode: ['', []],
          TAS2Code: ['', []],
          TAS3Code: ['', []],
          A11Code: ['', []],
          CFDACode: ['', []],
          OMBAgencyCode: ['', []]
        });
        break;
      default:
        break;
    }
  }

  populateOrgBasicForm(org, endDate) {
    this.basicInfoForm.get('orgName').setValue(org.name);
    this.basicInfoForm
      .get('orgDescription')
      .setValue(org.summary ? org.summary : '');
    this.basicInfoForm
      .get('orgShortName')
      .setValue(org.shortName ? org.shortName : '');

    this.startDateInitVal = moment(endDate).format('MMM DD, YYYY');
    this.basicInfoForm.get('orgStartDate').setValue(endDate);

    if (this.orgType.toLowerCase() === 'office') {
      if (org.newIsFunding) {
        this.indicateFundRadioModel = org.newIsAward
          ? 'Funding/Awarding'
          : 'Funding';
      } else {
        this.indicateFundRadioModel = 'Other';
      }
    }
  }

  populateOrgForms(org) {
    switch (this.orgType.toLowerCase()) {
      case 'office':
        this.officeCodesForm
          .get('FPDSCode')
          .setValue(org.fpdsCode ? org.fpdsCode : '');
        break;
      case 'agency':
      case 'majorcommand':
      case 'subcommand':
        this.agencyCodesForm
          .get('FPDSCode')
          .setValue(org.fpdsCode ? org.fpdsCode : '');
        this.agencyCodesForm
          .get('OMBBureauCode')
          .setValue(org.ombAgencyCode ? org.ombAgencyCode : '');
        break;
      case 'department':
        this.deptCodesForm
          .get('FPDSCode')
          .setValue(org.fpdsCode ? org.fpdsCode : '');
        this.deptCodesForm
          .get('TAS2Code')
          .setValue(org.tas2Code ? org.tas2Code : '');
        this.deptCodesForm
          .get('TAS3Code')
          .setValue(org.tas3Code ? org.tas3Code : '');
        this.deptCodesForm
          .get('A11Code')
          .setValue(org.a11TacCode ? org.a11TacCode : '');
        this.deptCodesForm
          .get('CFDACode')
          .setValue(org.cfdaCode ? org.cfdaCode : '');
        this.deptCodesForm
          .get('OMBAgencyCode')
          .setValue(org.ombAgencyCode ? org.ombAgencyCode : '');
        break;
      default:
        break;
    }
  }

  getOrgTypeSpecialInfo(orgType) {
    this.orgCodeInfo = [];
    switch (orgType.toLowerCase()) {
      case 'office':
        this.getOrgCodes(this.officeCodesForm, 'FPDSCode', 'FPDS Code', 'fpdsCode');
        break;
      case 'agency':
      case 'majorcommand':
      case 'subcommand':
        this.getOrgCodes(this.agencyCodesForm, 'FPDSCode', 'FPDS Code', 'fpdsCode');
        this.getOrgCodes(this.agencyCodesForm, 'OMBBureauCode', 'OMB Code', 'ombAgencyCode');
        break;
      case 'department':
        this.getOrgCodes(this.deptCodesForm, 'FPDSCode', 'FPDS Code', 'fpdsCode');
        this.getOrgCodes(this.deptCodesForm, 'TAS2Code', 'TAS2 Code', 'tas2Code');
        this.getOrgCodes(this.deptCodesForm, 'TAS3Code', 'TAS3 Code', 'tas3Code');
        this.getOrgCodes(this.deptCodesForm, 'A11Code', 'A11 Code', 'a11TacCode');
        this.getOrgCodes(this.deptCodesForm, 'CFDACode', 'CFDA Code', 'cfdaCode');
        this.getOrgCodes(this.deptCodesForm, 'OMBAgencyCode', 'OMB Agency Code', 'ombAgencyCode');
        break;
      default:
        break;
    }
  }

  getOrgCodes(
    orgForm: FormGroup,
    codeType: string,
    desc: string,
    fieldName: string
  ) {
    this.orgCodeInfo.push({ des: desc, value: orgForm.get(codeType).value });
    this.orgObj[fieldName] = orgForm.get(codeType).value;
  }

  generateBasicOrgObj() {
    if (!this.isCreateMode()) this.orgObj = this.orgFormConfig.org;
    this.orgObj['name'] = this.basicInfoForm.get('orgName').value;
    this.orgObj['startDate'] = this.basicInfoForm.get('orgStartDate').value;
    if (this.basicInfoForm.get('orgEndDate').value !== '')
      this.orgObj['endDate'] = this.basicInfoForm.get('orgEndDate').value;
    this.orgObj['summary'] = this.basicInfoForm.get('orgDescription').value;
    this.orgObj['shortName'] = this.basicInfoForm.get('orgShortName').value;
    this.orgObj['type'] = this.orgTypeCreateMap[this.orgType.toLowerCase()];
    if (this.isAddressNeeded()) {
      this.orgObj['newIsAward'] =
        this.indicateFundRadioModel === 'Funding/Awarding' ? true : false;
      this.orgObj['newIsFunding'] =
        this.indicateFundRadioModel === 'Funding/Awarding' ||
        this.indicateFundRadioModel === 'Funding'
          ? true
          : false;
      if (this.isCreateMode()) {
        this.createOrgAddresses();
      } else {
        this.orgObj['orgAddresses'].length == 0 ? this.createOrgAddresses() : this.updateOrgAddresses();
      }    
    }
    
    }

  createOrgAddresses() {
    this.orgObj['orgAddresses'] = [];
    this.orgAddresses.forEach(e => {
      let addrType = '';
      Object.keys(this.addrTypeMaping).forEach(key => {
        if (this.addrTypeMaping[key] === e.addrModel.addrType) addrType = key;
      });
      this.orgObj['orgAddresses'].push({
        type: addrType,
        city: e.addrModel.city,
        countryCode: e.addrModel.country,
        state: e.addrModel.state,
        streetAddress: e.addrModel.street1,
        streetAddress2: e.addrModel.street2,
        zipcode: e.addrModel.zip
      });
    });
  }

  updateOrgAddresses() {
    this.orgObj['orgAddresses'] = this.orgFormConfig.org.orgAddresses;
    this.orgAddresses.forEach(e => {
      let addrType = '';
      Object.keys(this.addrTypeMaping).forEach(key => {
        if (this.addrTypeMaping[key] === e.addrModel.addrType) addrType = key;
      });
      this.orgObj['orgAddresses'].forEach(addr => {
        if (addr.type === addrType) {
          addr['city'] = e.addrModel.city;
          addr['countryCode'] = e.addrModel.country;
          addr['state'] = e.addrModel.state;
          addr['streetAddress'] = e.addrModel.street1;
          addr['streetAddress2'] = e.addrModel.street2;
          addr['zipcode'] = e.addrModel.zip;
        }
      });
    });
  }

  setOrgStartDate(val) {
    this.basicInfoForm.get('orgStartDate').setValue(val);
  }
  setOrgEndDate(val) {
    this.basicInfoForm.get('orgEndDate').setValue(val);
  }

  onReviewFormClick() {
    // Validate all the necessary fields in the organization creation form
    let isValid = this.validateAndFormatDetailsError() && !this.basicInfoForm.invalid ;

    if (!this.isAddressNeeded()) {
      if ( isValid ) this.setupReviewPage();
    }else {
      let validateRes = this.addrForms.map(e => e.validateForm());
      Observable.forkJoin(validateRes).subscribe(
        results => {
          let isAddrValid = results.filter(e => {return e['description'] !== 'VALID'; }).length === 0;
          if ( isAddrValid && isValid ) this.setupReviewPage();
        },
        error => {}
      );
    }
  }

  setupReviewPage() {
    this.onReviewClick.emit(true);
    this.updateOrgInfoForReview();
    this.updatePageText();
    this.getOrgTypeSpecialInfo(this.orgType);
    this.generateBasicOrgObj();
  }

  onEditFormClick() {
    this.createOrgPage = true;
    this.reviewOrgPage = false;
    this.section = 'create';
    this.updatePageText();
    this.onEditClick.emit(true);
  }

  onConfirmFormClick() {
    // submit the form and navigate to the new created organization detail page
    if (this.isCreateMode()) {
      this.fhService
        .createOrganizationV2(
          this.orgObj,
          this.fullParentPath,
          this.fullParentPathName
        )
        .subscribe(val => {
          this.flashMsgService.showFlashMsg();
          this.flashMsgService.isCreateOrgSuccess = true;
          this.router.navigate(['/org/detail', val.orgKey, 'profile']);
          setTimeout(() => {
            this.flashMsgService.hideFlashMsg();
          }, 5000);
        }, error => {this.showErrorAlertFooter('Failed to create organization'); });
    } else {
      let parentOrgId;
      if(this.orgFormConfig.parentId.fullParentPath){
        parentOrgId = this.orgFormConfig.parentId.fullParentPath.split('.')[1];
      }
      let endDate = this.orgFormConfig.endDate? moment(this.orgFormConfig.endDate).format('MM-DD-YYYY') : '';
      if(moment(this.orgObj.startDate).isSame(moment(this.orgObj.endDate))){
        this.orgObj['endDate'] = '';
      }
     this.fhService.updateOrganizationV2(this.orgObj, true, this.orgObj.orgKey, 
                                        parentOrgId, endDate).subscribe( res =>{
                                this.flashMsgService.showFlashMsg();
                                this.flashMsgService.isMoveOrgSuccess = true;
                              
                                this.router.navigate(['/org/detail',res.orgKey,'profile']);
                                setTimeout(() => {
                                  this.flashMsgService.hideFlashMsg();
                                  }, 5000);
                              },error => {this.showErrorAlertFooter('Failed to update organization'); });

      // this.orgObj.fullParentPath =
      //   this.fullParentPath === ''
      //     ? '' + this.orgObj.orgKey
      //     : this.fullParentPath + '.' + this.orgObj.orgKey;
      // this.orgObj.fullParentPathName =
      //   this.fullParentPathName === ''
      //     ? this.orgObj.name.split(' ').join('_')
      //     : this.fullParentPathName +
      //       '.' +
      //       this.orgObj.name.split(' ').join('_');
      // this.fhService.updateOrganization(this.orgObj, true).subscribe(val => {
      //   this.flashMsgService.showFlashMsg();
      //   this.flashMsgService.isMoveOrgSuccess = true;

      //   this.router.navigate([
      //     '/org/detail',
      //     this.orgFormConfig.org.orgKey,
      //     'profile'
      //   ]);
      //   setTimeout(() => {
      //     this.flashMsgService.hideFlashMsg();
      //   }, 5000);
      // }, error => {this.showErrorAlertFooter('Failed to update organization'); });
    }
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

  isAddressNeeded(): boolean {
    return this.orgType === this.orgTypeWithAddress;
  }

  showFullDescription() {this.showFullDes = true; }
  hideFullDescription() {this.showFullDes = false; }

  updateOrgInfoForReview() {
    this.section = 'review';
    this.createOrgPage = false;
    this.reviewOrgPage = true;
    this.orgInfo = [];
    let endDate = this.basicInfoForm.get('orgEndDate').value;
    if (!this.isCreateMode()) {
      this.orgInfo.push({
        des: 'Department Name',
        value: this.fhTitleCasePipe.transform(this.parentOrg.l1Name)
      });
      this.orgInfo.push({
        des: 'Sub-Tier Name',
        value: this.fhTitleCasePipe.transform(this.parentOrg.l2Name)
      });
    }
    this.orgInfo.push({
      des: this.orgTypeMap[this.orgType.toLowerCase()] + ' Name',
      value: this.basicInfoForm.get('orgName').value
    });
    this.orgInfo.push({
      des: 'Start Date',
      value: moment(this.basicInfoForm.get('orgStartDate').value).format('MM/DD/YYYY')
    });
    this.orgInfo.push({
      des: 'End Date',
      value: endDate === '' ? '' : moment(endDate).format('MM/DD/YYYY')
    });
    this.orgInfo.push({
      des: 'Description',
      value: this.basicInfoForm.get('orgDescription').value
    });
    this.orgInfo.push({
      des: 'Shortname',
      value: this.basicInfoForm.get('orgShortName').value
    });
    if (this.isAddressNeeded()) {
      this.orgInfo.push({
        des: 'Indicate Funding',
        value: this.indicateFundRadioModel
      });
    }
  }

  onCancelBtnClick() {
    this.onCancelClick.emit(true);
  }

  validateAndFormatDetailsError(): boolean {
    this.basicInfoForm.get('orgName').markAsDirty();
    this.basicInfoForm.get('orgStartDate').markAsDirty();
    this.basicInfoForm.get('orgEndDate').markAsDirty();

    let startDate = this.basicInfoForm.get('orgStartDate').value;
    let endDate = this.basicInfoForm.get('orgEndDate').value;
    let isValid = this.validAndFormatField(this.orgName.wrapper, this.basicInfoForm.get('orgName').value)
      && this.validAndFormatField(this.orgStartDateWrapper, startDate);
    this.orgEndDateWrapper.errorMessage = '';
    if (startDate !== '' && endDate !== '') {
      if (!moment(endDate).isSameOrAfter(moment().toDate())) {
        this.orgEndDateWrapper.errorMessage = 'End date cannot be earlier than today';
        isValid = false;
      }
      if (moment(startDate).isAfter(moment(endDate))) {
        this.orgEndDateWrapper.errorMessage = 'End date cannot be earlier than start date';
        isValid = false;
      }
    }

    if (this.isAddressNeeded()) {
      return this.validAndFormatField(this.indicateFundRadioConfig, this.indicateFundRadioModel) && isValid;
    }
    return isValid;
  }

  validAndFormatField(wrapper, fieldValue): boolean {
    let isValid = true;
    wrapper.errorMessage = '';
    if ( fieldValue === '') {
      wrapper.errorMessage = 'This field cannot be empty';
      isValid = false;
    }
    return isValid;
  }

  showErrorAlertFooter(desc) {
    this.alertFooter.registerFooterAlert({
      title: '',
      description: desc,
      type: 'error',
      timer: 3200
    });
  }

}
