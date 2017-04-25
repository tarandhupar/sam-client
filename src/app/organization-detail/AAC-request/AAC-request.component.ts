import { Component, ViewChild, ViewChildren, QueryList } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SamTextComponent } from 'sam-ui-kit/form-controls/text/text.component';
import { OrgAddrFormComponent } from '../../app-components/address-form/address-form.component';
import { LabelWrapper } from 'sam-ui-kit/wrappers/label-wrapper/label-wrapper.component';

function validDateTime(c: FormControl) {
  let invalidError = {message: 'Date is invalid'};

  if (c.value === 'Invalid Date') {
    return invalidError;
  }
}

function isRequired(c: FormControl) {
  if(c.value === '') return {required:true};
}

@Component ({
  templateUrl: 'AAC-request.template.html'
})
export class AACRequestPage {

  @ViewChildren(OrgAddrFormComponent) addrForms:QueryList<OrgAddrFormComponent>;

  // Needed if it is a state/local office selected
  @ViewChild('stateOfficeName') stateOfficeName: SamTextComponent;

  // Needed if it is a contractor selected
  @ViewChild('contractName') contractorName: SamTextComponent;
  @ViewChild('contractNum') contractNum: SamTextComponent;
  @ViewChild('contractCAGECode') contractCAGECode: SamTextComponent;
  @ViewChild('contractAdmin') contractAdmin: SamTextComponent;
  @ViewChild('contractorExpireDateWrapper') contractorExpireDateWrapper: LabelWrapper;

  // Needed for fpds report form
  @ViewChild('agencyCode') agencyCode: SamTextComponent;
  @ViewChild('cgacCode') cgacCode: SamTextComponent;

  aacTypeRadioModel:any = '';
  aacTypeRadioConfig = {
    options: [
      {value: 'single', label: 'Single AAC Request', name: 'single'},
      {value: 'multiple', label: 'Multiple AAC Request (Bulk Upload)', name: 'multiple'},
    ],
    name: 'aacType',
    label: 'Is the request a single AAC or multiple AACs?',
    errorMessage: ''
  };

  aacExistRadioModel:any = 'No';
  aacExistRadioConfig = {
    options: [
      {value: 'Yes', label: 'Yes', name: 'Yes'},
      {value: 'No', label: 'No', name: 'No'},
    ],
    name: 'aacExistence',
    label: 'Does an AAC exist for this organization?',
    errorMessage: ''
  };

  aacOfficeRadioModel:any = 'Federal Office';
  aacOfficeConfig = {
    options: [
      {value: 'Federal Office', label: 'Federal Office', name: 'Federal Office'},
      {value: 'State/Local Office', label: 'State/Local Office', name: 'State/Local Office'},
      {value: 'Contractor Office', label: 'Contractor Office', name: 'Contractor Office'},
    ],
    name: 'aacOffice',
    label: 'Is the request for a Federal Office, State/Local Office or Contractor?',
    errorMessage: ''
  };
  aacStateOrgName:string = '';
  aacFederalOrgName:any;
  aacFederalOrgNameErrorMsg:string = '';

  aacReasonCbxModel:any = [];
  aacReasonCbxConfig = {
    options: [
      {value: 'Used for Ordering/Requisitioning Purposes', label: 'Used for Ordering/Requisitioning Purposes', name: 'Used for Ordering/Requisitioning Purposes'},
      {value: 'Used for Personal Property Reporting or Transfer', label: 'Used for Personal Property Reporting or Transfer', name: 'Used for Personal Property Reporting or Transfer'},
      {value: 'Used for Grants or Financial Assistance Reporting', label: 'Used for Grants or Financial Assistance Reporting', name: 'Used for Grants or Financial Assistance Reporting'},
      {value: 'Used for Shipping Purposes', label: 'Used for Shipping Purposes', name: 'Used for Shipping Purposes'},
      {value: 'Used for Billing Purposes', label: 'Used for Billing Purposes', name: 'Used for Billing Purposes'},
      {value: 'Used for Reporting with FPDS', label: 'Used for Reporting with FPDS', name: 'Used for Reporting with FPDS'},
    ],
    name: 'aacReason',
    label: 'Provide purpose for AAC Request:',
    errorMessage: ''
  };

  hideBillingForm = false;
  hideShippingForm = false;
  billingAddrFillCbxModel:any = [];
  shippingAddrFillCbxModel:any = [];
  duplicateAddrCbxConfig = {
    options: [
      {value: 'same as mailing address', label: 'Same as Mailing Address', name: 'Same as Mailing Address'},
    ],
    name: 'duplicate-address-filling',
    label: '',
    errorMessage: ''
  };


  aacOfficeInfo:any = [];
  orgAddresses:any = [];
  mailAddr:any = {addrType:"Mailing Address",country:"",state:"",city:"",street1:"",street2:"",postalCode:""};
  billAddr:any = {addrType:"Billing Address",country:"",state:"",city:"",street1:"",street2:"",postalCode:""};
  shipAddr:any = {addrType:"Shipping Address",country:"",state:"",city:"",street1:"",street2:"",postalCode:""};
  emptyAddrObj:any = {addrType:"",country:"",state:"",city:"",street1:"",street2:"",postalCode:""};
  commonAddr:any = {};
  stateOfficeForm:FormGroup;
  contractorForm:FormGroup;
  fpdsReportForm:FormGroup;
  aacObj:any = {};
  requestIsEdit = true;
  requestIsReview = false;

  constructor(private builder:FormBuilder){}

  ngOnInit(){
    this.stateOfficeForm = this.builder.group({
      stateOfficeName:['',[]]
    });
    this.contractorForm = this.builder.group({
      contractName: ['', []],
      contractNum: ['', []],
      cageCode: ['', []],
      contractAdmin: ['', []],
      contractExpireDate: ['', [validDateTime, isRequired]],
    });
    this.fpdsReportForm = this.builder.group({
      agencyCode: ['', []],
      cgacCode: ['', []],
    });
  }

  setContractExpireDate(val){this.contractorForm.get('contractExpireDate').setValue(val);}

  generateAACRequestPostObj():any{
    let aacPostObj = {
      isAACExistOrg: this.aacExistRadioModel === 'Yes',
      requestFor: this.aacOfficeRadioModel,
      officeAddresses: this.orgAddresses
    };
    return aacPostObj;
  }

  onReviewAACRequestClick(){
    this.formatOfficeInfoError();
    this.formatReasonInfoError();
    if(this.isAddressFormValid() && this.isOfficeInfoValid() && this.isReasonInfoValid()){
      this.aacOfficeInfo = this.generateRequestOfficeInfo();
      this.orgAddresses = [this.mailAddr];
      if(this.isBillingAddrRequired())this.orgAddresses.push(this.billAddr);
      if(this.isShippingAddrRequired())this.orgAddresses.push(this.shipAddr);
      this.requestIsEdit = false;
      this.requestIsReview = true;
    }
  }

  onEditFormClick(){
    this.formatOfficeInfoError();
    this.formatReasonInfoError();
    this.isAddressFormValid();
    this.requestIsEdit = true;
    this.requestIsReview = false;
  }

  onCancelAACRequestClick(){}

  generateRequestOfficeInfo():any{
    let requestOfficeInfo = [];
    requestOfficeInfo.push({desc:'Does an AAC exist for this organization',value:this.aacExistRadioModel});
    requestOfficeInfo.push({desc:'Is the request for a Federal Office, State/Local Office or Contractor', value: this.aacOfficeRadioModel});
    switch (this.aacOfficeRadioModel){
      case 'Contractor Office':
        requestOfficeInfo.push({desc:'Contractor Name', value: this.contractorForm.get("contractName").value});
        requestOfficeInfo.push({desc:'Contract Number', value: this.contractorForm.get("contractNum").value});
        requestOfficeInfo.push({desc:'CAGE Code', value: this.contractorForm.get("cageCode").value});
        requestOfficeInfo.push({desc:'Contract Administrator Name', value: this.contractorForm.get("contractAdmin").value});
        requestOfficeInfo.push({desc:'Contract Expiry Date', value: this.contractorForm.get("contractExpireDate").value});
        break;
      case 'Federal Office':
        requestOfficeInfo.push({desc:'Organization Name', value: this.aacFederalOrgName.name});
        break;
      case 'State/Local Office':
        requestOfficeInfo.push({desc:'Organization Name', value: this.stateOfficeForm.get("stateOfficeName").value});
        break;
    }
    return requestOfficeInfo;
  }

  getFederalOrgName(org){
    this.aacFederalOrgName = org;
  }


  isAddressFormValid():boolean{
    let isValid = true;
    this.addrForms.forEach( e => {if(!e.validateForm()) isValid = false;});
    return isValid;
  }

  isOfficeInfoValid():boolean{
    let isValid = true;
    switch (this.aacOfficeRadioModel){
      case 'Contractor Office':
        isValid = this.contractorForm.valid;
        break;
      case 'Federal Office':
        isValid = !!this.aacFederalOrgName;
        break;
      case 'State/Local Office':
        isValid = this.stateOfficeForm.valid;
        break;
    }
    return isValid;
  }

  isReasonInfoValid():boolean{
    if(this.isReasonContainsFPDSReport()){
      return this.fpdsReportForm.valid;
    }
    return this.aacReasonCbxModel.length !== 0;
  }

  isSingleAACRequest():boolean {return this.aacTypeRadioModel === 'single';}
  isMultiAACRequest():boolean {return this.aacTypeRadioModel === 'mulitple';}
  isReasonContainsFPDSReport():boolean {return this.aacReasonCbxModel.indexOf(this.aacReasonCbxConfig.options[5].value) !== -1;}

  isBillingAddrRequired():boolean{
    return this.aacReasonCbxModel.indexOf(this.aacReasonCbxConfig.options[0].value) !== -1 ||
        this.aacReasonCbxModel.indexOf(this.aacReasonCbxConfig.options[1].value) !== -1 ||
        this.aacReasonCbxModel.indexOf(this.aacReasonCbxConfig.options[4].value) !== -1;
  }

  isShippingAddrRequired():boolean{
    return this.aacReasonCbxModel.indexOf(this.aacReasonCbxConfig.options[0].value) !== -1 ||
      this.aacReasonCbxModel.indexOf(this.aacReasonCbxConfig.options[1].value) !== -1 ||
      this.aacReasonCbxModel.indexOf(this.aacReasonCbxConfig.options[3].value) !== -1;
  }

  formatReasonInfoError(){
    this.aacReasonCbxConfig.errorMessage = this.aacReasonCbxModel.length === 0?"This field cannot be empty":"";

    if(this.isReasonContainsFPDSReport()){
      this.fpdsReportForm.get("agencyCode").markAsDirty();
      this.fpdsReportForm.get("cgacCode").markAsDirty();
      this.agencyCode.wrapper.formatErrors(this.fpdsReportForm.get("agencyCode"));
      this.cgacCode.wrapper.formatErrors(this.fpdsReportForm.get("cgacCode"));
    }
  }

  formatOfficeInfoError(){
    switch (this.aacOfficeRadioModel){
      case 'Contractor Office':
        this.formatContractFormError();
        break;
      case 'Federal Office':
        this.aacFederalOrgNameErrorMsg = !!this.aacFederalOrgName?'':'This field cannot be empty';
        break;
      case 'State/Local Office':
        this.stateOfficeForm.get("stateOfficeName").markAsDirty();
        this.stateOfficeName.wrapper.formatErrors(this.stateOfficeForm.get("stateOfficeName"));
        break;
    }
  }

  formatContractFormError(){
    this.contractorForm.get("contractName").markAsDirty();
    this.contractorForm.get("contractNum").markAsDirty();
    this.contractorForm.get("cageCode").markAsDirty();
    this.contractorForm.get("contractAdmin").markAsDirty();
    this.contractorForm.get("contractExpireDate").markAsDirty();
    this.contractorName.wrapper.formatErrors(this.contractorForm.get("contractName"));
    this.contractNum.wrapper.formatErrors(this.contractorForm.get("contractNum"));
    this.contractCAGECode.wrapper.formatErrors(this.contractorForm.get("cageCode"));
    this.contractAdmin.wrapper.formatErrors(this.contractorForm.get("contractAdmin"));
    this.contractorExpireDateWrapper.formatErrors(this.contractorForm.get("contractExpireDate"));
  }

  onDuplicateFillChecked(addrType, val){
    if(addrType === "Billing Address"){
      this.billAddr = this.updateAddressFromMailAddr(val,addrType);
      this.hideBillingForm = val.length > 0;
    }else if (addrType === "Shipping Address"){
      this.shipAddr = this.updateAddressFromMailAddr(val,addrType);
      this.hideShippingForm = val.length > 0;
    }
  }

  updateAddressFromMailAddr(addrCbxModel, addrType):any{
    let addr;
    addr = addrCbxModel.length > 0? Object.assign({},this.mailAddr):Object.assign({},this.emptyAddrObj);
    addr.addrType = addrType;
    return addr;
  }
}
