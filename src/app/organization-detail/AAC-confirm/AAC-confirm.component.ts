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
        this.officeInfo = this.generateRequestOfficeInfo(this.aacObj);
      });
    setTimeout(()=>{this.successAlertMsg = false;}, 3000);
  }

  getAACRequestDetail(requestId):any{
    let aacObj:any = {};
    this.aacRequestService.getAACRequestDetail(requestId).subscribe(
      val => {
        aacObj = val._embedded.aac;
      }
    );
    return aacObj;
  }

  generateRequestOfficeInfo(aacObj):any{
    let requestOfficeInfo = [];
    requestOfficeInfo.push({desc:'Does an AAC exist for this organization',value:aacObj.isAACExist});
    requestOfficeInfo.push({desc:'Is the request for a Federal Office, State/Local Office or Contractor', value: aacObj.aacType});
    switch (aacObj.aacType){
      case 'Contractor Office':
        requestOfficeInfo.push({desc:'Contractor Name', value: aacObj.contractorName});
        requestOfficeInfo.push({desc:'Contract Number', value: aacObj.contractNum});
        requestOfficeInfo.push({desc:'CAGE Code', value: aacObj.cgacCode});
        requestOfficeInfo.push({desc:'Contract Administrator Name', value: aacObj.contractAdmin});
        requestOfficeInfo.push({desc:'Contract Expiry Date', value: aacObj.contractExpireDate});
        break;
      case 'Federal Office':
        requestOfficeInfo.push({desc:'Organization Name', value: aacObj.organizationName});
        break;
      case 'State/Local Office':
        requestOfficeInfo.push({desc:'Organization Name', value: aacObj.organizationName});
        break;
    }
    return requestOfficeInfo;
  }

  isReasonContainsFPDSReport(){return this.aacObj.requestReasons.indexOf('Used for Reporting with FPDS') !== -1;}
}
