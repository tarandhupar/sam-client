import { Component, ViewChild, ViewChildren, QueryList, NgZone } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SamTextComponent } from 'sam-ui-kit/form-controls/text/text.component';
import { OrgAddrFormComponent } from '../../app-components/address-form/address-form.component';
import { LabelWrapper } from 'sam-ui-kit/wrappers/label-wrapper/label-wrapper.component';
import { AACRequestService } from 'api-kit/aac-request/aac-request.service.ts';
import { IAMService } from "api-kit/iam/iam.service";

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
  templateUrl: 'AAC-request.template.html',
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

  aacOfficeRadioModel:any = '';
  aacOfficeConfig = {
    options: [],
    name: 'aacOffice',
    label: 'Is the request for a Federal Office, State/Local Office or Contractor?',
    errorMessage: ''
  };
  aacStateOrgName:string = '';
  aacFederalOrgName:any;
  aacFederalOrgNameErrorMsg:string = '';

  aacReasonCbxModel:any = [];
  aacReasonCbxConfig = {
    options: [],
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

  reasonValueMap: any = {};
  addrTypePerReason:any = [];
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
  requestIsConfirm = false;
  successAlertMsg = false;

  user = null;
  isSignedIn = false;

  constructor(private builder:FormBuilder,
              private aacRequestService:AACRequestService,
              private iamService: IAMService,
              private zone: NgZone){}

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
    this.aacRequestService.getAACRequestFormDetail().subscribe(
      data => {
        this.aacReasonCbxConfig.options = [];
        this.addrTypePerReason = {};
        data.requestAddressTypes.forEach( e => {
          let name = e.requestAddressType.requestTypeName;
          this.aacReasonCbxConfig.options.push({value:name, label:name, name:name});
          this.addrTypePerReason[name] = [];
          e.requestAddressMapping.forEach(addr => {this.addrTypePerReason[name].push(addr.addressTypeName)});
          this.reasonValueMap[name] = e.requestAddressType.requestTypeId;
        });

        this.aacOfficeConfig.options = [];
        data.orgTypes.forEach( e => {
          this.aacOfficeConfig.options.push({value:e.orgTypeId+"-"+e.orgTypeName,label:e.orgTypeName,name:e.orgTypeName});
        });
        this.aacOfficeRadioModel = this.aacOfficeConfig.options[0].value;
    });
    this.checkSignInUser();
  }

  setContractExpireDate(val){this.contractorForm.get('contractExpireDate').setValue(val);}

  generateAACRequestPostObj():any{
    let aacPostObj:any = {};
    aacPostObj.aacExists = this.aacExistRadioModel === 'Yes';
    aacPostObj.orgTypeId = this.aacOfficeRadioModel.split('-')[0];
    aacPostObj.requestorEmailId = this.user.email;
    aacPostObj.username = this.user.fullName;
    aacPostObj.aacLink = "/aac-confirm";

    if (this.aacOfficeRadioModel.includes('Contractor')) {
      aacPostObj.orgName = this.contractorForm.get("contractName").value;
      aacPostObj.contractNumber = this.contractorForm.get("contractNum").value;
      aacPostObj.cageCode = this.contractorForm.get("cageCode").value;
      aacPostObj.contractAdminName = this.contractorForm.get("contractAdmin").value;
      aacPostObj.contractExpiryDate = this.contractorForm.get("contractExpireDate").value;
    } else if (this.aacOfficeRadioModel.includes('Federal')) {
      aacPostObj.orgName = this.aacFederalOrgName.name;
    } else if (this.aacOfficeRadioModel.includes('State')){
      aacPostObj.orgName = this.stateOfficeForm.get("stateOfficeName").value;
    }

    aacPostObj.requestIds = [];
    this.aacReasonCbxModel.forEach( e => {aacPostObj.requestIds.push(this.reasonValueMap[e])});

    if(this.isReasonContainsFPDSReport()){
      aacPostObj.cgacCode = this.fpdsReportForm.get("cgacCode").value;
      aacPostObj.subTierAgencyCode = this.fpdsReportForm.get("agencyCode").value;
    }

    aacPostObj.addressDetails = [];
    this.orgAddresses.forEach( e => {
      aacPostObj.addressDetails.push({
        street1:e.street1,
        street2:e.street2,
        code:e.postalCode,
        state:e.state,
        city:e.city,
        country:e.country,
        addressTypeName:e.addrType
      });
    });
    return aacPostObj;
  }

  onReviewAACRequestClick(){
    this.formatOfficeInfoError();
    this.formatReasonInfoError();
    if(this.isAddressFormValid() && this.isOfficeInfoValid() && this.isReasonInfoValid()){
      this.aacOfficeInfo = this.generateRequestOfficeInfo();
      this.orgAddresses = [this.mailAddr];
      if(this.isAddrTypeRequired("Billing Address")){
        if(this.hideBillingForm)this.billAddr = Object.assign({},this.mailAddr);
        this.billAddr.addrType = "Billing Address";
        this.orgAddresses.push(this.billAddr);
      }
      if(this.isAddrTypeRequired("Shipping Address")){
        if(this.hideShippingForm)this.shipAddr = Object.assign({},this.mailAddr);
        this.shipAddr.addrType = "Shipping Address";
        this.orgAddresses.push(this.shipAddr);
      }
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

  onSubmitFormClick(){
    this.aacRequestService.postAACRequest(this.generateAACRequestPostObj()).subscribe(
      val => {
        this.requestIsReview = false;
        this.requestIsConfirm = true;
        this.successAlertMsg = true;
        setTimeout(()=>{this.successAlertMsg = false;}, 3000);
      }
    );
  }

  generateRequestOfficeInfo():any {
    let requestOfficeInfo = [];
    requestOfficeInfo.push({desc: 'Does an AAC exist for this organization', value: this.aacExistRadioModel});
    requestOfficeInfo.push({
      desc: 'Is the request for a Federal Office, State/Local Office or Contractor',
      value: this.aacOfficeRadioModel.substr(this.aacOfficeRadioModel.indexOf('-')+1,this.aacOfficeRadioModel.length - this.aacOfficeRadioModel.indexOf('-'))
    });
    if (this.aacOfficeRadioModel.includes('Contractor')) {
      requestOfficeInfo.push({desc: 'Contractor Name', value: this.contractorForm.get("contractName").value});
      requestOfficeInfo.push({desc: 'Contract Number', value: this.contractorForm.get("contractNum").value});
      requestOfficeInfo.push({desc: 'CAGE Code', value: this.contractorForm.get("cageCode").value});
      requestOfficeInfo.push({
        desc: 'Contract Administrator Name',
        value: this.contractorForm.get("contractAdmin").value
      });
      requestOfficeInfo.push({
        desc: 'Contract Expiry Date',
        value: this.contractorForm.get("contractExpireDate").value
      });

    } else if (this.aacOfficeRadioModel.includes('Federal')) {
      requestOfficeInfo.push({desc: 'Organization Name', value: this.aacFederalOrgName.name});
    } else if (this.aacOfficeRadioModel.includes('State')){
      requestOfficeInfo.push({desc:'Organization Name', value: this.stateOfficeForm.get("stateOfficeName").value});
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

    if(this.aacOfficeRadioModel.includes('Contract')){
      isValid = this.contractorForm.valid;
    }else if(this.aacOfficeRadioModel.includes('Federal')){
      isValid = !!this.aacFederalOrgName;
    }else if(this.aacOfficeRadioModel.includes('State')){
      isValid = this.stateOfficeForm.valid;
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
  isReasonContainsFPDSReport():boolean {return this.aacReasonCbxModel.indexOf("Used for Reporting with FPDS") !== -1;}

  isAddrTypeRequired(addrType):boolean{
    let addrRequired = false;

    this.aacReasonCbxModel.forEach( e => {
      if(this.addrTypePerReason[e].indexOf(addrType) !== -1) addrRequired = true;
    });
    return addrRequired;
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
    if(this.aacOfficeRadioModel.includes('Contract')){
      this.formatContractFormError();
    }else if(this.aacOfficeRadioModel.includes('Federal')){
      this.aacFederalOrgNameErrorMsg = !!this.aacFederalOrgName?'':'This field cannot be empty';
    }else if(this.aacOfficeRadioModel.includes('State')){
      this.stateOfficeForm.get("stateOfficeName").markAsDirty();
      this.stateOfficeName.wrapper.formatErrors(this.stateOfficeForm.get("stateOfficeName"));
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
    if(addrType.includes("Billing")){
      this.hideBillingForm = val.length > 0;
      this.billAddr = this.updateFromMailAddr(this.hideBillingForm, addrType);
    }else if (addrType.includes("Shipping")){
      this.hideShippingForm = val.length > 0;
      this.shipAddr = this.updateFromMailAddr(this.hideShippingForm, addrType);
    }
  }

  updateFromMailAddr(update:boolean, addrType):any{
    let addr = update? Object.assign({},this.mailAddr):Object.assign({},this.emptyAddrObj);
    addr.addrType = addrType;
    return addr;
  }

  onEnterKeyClicked(){if(this.isSingleAACRequest()) this.onReviewAACRequestClick();}

  checkSignInUser() {
    //Get the sign in info
    this.isSignedIn = false;
    this.zone.runOutsideAngular(() => {
      this.iamService.iam.checkSession((user) => {
        this.zone.run(() => {
          this.isSignedIn = true;
          this.user = user;
        });
      });
    });
  }
}
