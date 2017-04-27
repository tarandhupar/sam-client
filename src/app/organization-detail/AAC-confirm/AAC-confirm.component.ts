import { Component } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { AACRequestService } from 'api-kit/aac-request/aac-request.service.ts';

@Component ({
  templateUrl: 'AAC-confirm.template.html'
})
export class AACConfirmPage {

  aacObj:any = {};
  requestId:string;
  successAlertMsg = true;
  officeInfo:any = [];

  constructor(private route: ActivatedRoute, private aacRequestService: AACRequestService){}

  ngOnInit(){
    this.route.params.subscribe(
      params => {
        this.requestId = params['requestId'];
        this.aacObj = this.getAACRequestDetail(this.requestId);
        this.officeInfo = this.generateRequestOfficeInfo(this.aacObj.aac);
      });
    setTimeout(()=>{this.successAlertMsg = false;}, 3000);
  }

  getAACRequestDetail(requestId):any{
    let aacObj:any = {};
    this.aacRequestService.getAACRequestDetail(requestId).subscribe(
      val => {aacObj = val;}
    );
    return aacObj;
  }


  generateRequestOfficeInfo(aacOfficeObj):any{
    let requestOfficeInfo = [];
    requestOfficeInfo.push({desc:'Does an AAC exist for this organization',value:aacOfficeObj.aacExists});
    requestOfficeInfo.push({desc:'Is the request for a Federal Office, State/Local Office or Contractor', value: aacOfficeObj.orgTypeName});
    if (aacOfficeObj.orgTypeName.includes('Contractor')) {
      requestOfficeInfo.push({desc: 'Contractor Name', value: aacOfficeObj.orgName});
      requestOfficeInfo.push({desc: 'Contract Number', value: aacOfficeObj.contractNumber});
      requestOfficeInfo.push({desc: 'CAGE Code', value: aacOfficeObj.cageCode});
      requestOfficeInfo.push({desc: 'Contract Administrator Name', value: aacOfficeObj.contractAdminName});
      requestOfficeInfo.push({desc: 'Contract Expiry Date', value: aacOfficeObj.contractExpiryDate});
    }else{
      requestOfficeInfo.push({desc:'Organization Name', value: aacOfficeObj.orgName});
    }
    return requestOfficeInfo;
  }

  isReasonContainsFPDSReport(){
    let isFPDSReport = false;
    this.aacObj.requestReasonList.forEach( e => {if(e.requestReasonName.includes('Used for Reporting with FPDS')) isFPDSReport = true;});
    return isFPDSReport;
  }
}
