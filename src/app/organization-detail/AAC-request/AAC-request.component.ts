import { Component } from "@angular/core";

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

  constructor(){}

  ngOnInit(){
    this.orgAddresses.push({addrModel:{addrType:"Mailing Address",country:"",state:"",city:"",street:"",postalCode:""},showAddIcon:false});
  }

  isSingleAACRequest():boolean {return this.aacTypeRadioModel === 'single';}
  isMultiAACRequest():boolean {return this.aacTypeRadioModel === 'mulitple';}
  isReasonContainsFPDSReport():boolean {return this.aacReasonCbxModel.indexOf('Used for Reporting with FPDS') !== -1;}

  setContractExpireDate(val){}
}
