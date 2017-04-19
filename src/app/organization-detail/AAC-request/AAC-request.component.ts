import { Component } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

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

  orgAddresses:any = [];
  contractorForm:FormGroup;
  fpdsReportForm:FormGroup;
  aacObj:any = {};
  requestIsEdit = true;
  requestIsReview = false;

  constructor(private builder:FormBuilder){}

  ngOnInit(){
    this.orgAddresses.push({addrModel:{addrType:"Mailing Address",country:"",state:"",city:"",street:"",postalCode:""},showAddIcon:false});
    this.contractorForm = this.builder.group({
      contractName: ['', []],
      contractNum: ['', []],
      OAGECode: ['', []],
      contractAdmin: ['', []],
      contractExpireDate: ['', [validDateTime, isRequired]],
    });
    this.fpdsReportForm = this.builder.group({
      agencyCode: ['', []],
      cgacCode: ['', []],
    })
  }

  isSingleAACRequest():boolean {return this.aacTypeRadioModel === 'single';}
  isMultiAACRequest():boolean {return this.aacTypeRadioModel === 'mulitple';}
  isReasonContainsFPDSReport():boolean {return this.aacReasonCbxModel.indexOf('Used for Reporting with FPDS') !== -1;}

  setContractExpireDate(val){this.contractorForm.get('contractExpireDate').setValue(val);}

  generateACCRequestObj(){
    this.aacObj = {};
    // generate Requesting Office Information
    this.aacObj.officeInfo = this.generateRequestOfficeInfo();
    // generate Reason for Requesting
    this.aacObj.reasonInfo = this.generateRequestReasonInfo();
    console.log(this.aacObj);
  }

  onReviewAACRequestClick(){
    this.requestIsEdit = false;
    this.requestIsReview = true;
    this.generateACCRequestObj();
    console.log(this.orgAddresses);
  }

  onEditFormClick(){
    this.requestIsEdit = true;
    this.requestIsReview = false;
  }

  onCancelAACRequestClick(){

  }

  generateRequestReasonInfo():any{
    let requestReasonInfo = [];
    requestReasonInfo.push({desc:'Provide purpose for AAC Request',value:this.aacReasonCbxModel.join('/')});
    if(this.aacReasonCbxModel.indexOf("Used for Reporting with FPDS") !== -1){
      requestReasonInfo.push({desc:'Sub-tier Agency Code',value:this.fpdsReportForm.get("agencyCode").value});
      requestReasonInfo.push({desc:'CGAC Code',value:this.fpdsReportForm.get("cgacCode").value});
    }
    return requestReasonInfo;
  }

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
        requestOfficeInfo.push({desc:'Organization Name', value: this.aacStateOrgName});
        break;
    }
    return requestOfficeInfo;
  }

  getFederalOrgName(org){
    this.aacFederalOrgName = org;
  }
}
