import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs";

@Injectable()
export class AACRequestService {
  constructor(private apiService:WrapperService) {
  }

  getAACRequestDetail(requestId){

    // let apiOptions: any = {
    //   name: 'aac',
    //   suffix: '',
    //   method: 'GET',
    //   oParam: { 'requestId':requestId }
    // };
    //
    // return this.apiService.call(apiOptions);
    return Observable.of({
      _embedded:{
        aac:{
          requestId: 1,
          isAACExist: false,
          orgName: "Form Supply Management",
          aacType: "Contractor Office",
          requestReasons:["Used for Ordering/Requisitioning Purposes", "Used for Reporting with FPDS"],
          agencyCode: "ABC",
          cgacCode: "ABC",
          contractorName: "Temp Contractor",
          contractNum: "DOC123456",
          cageCode: "123456",
          contractAdmin: "Jane Doe",
          contractExpireDate: "2017-12-12",
          orgAddresses:[
            {addrType:"Mailing Address",country:"USA",state:"DC",city:"Washington",street:"813 Rosewood Lane", postalCode:"20007"},
            {addrType:"Billing Address",country:"USA",state:"DC",city:"Washington",street:"813 Rosewood Lane", postalCode:"20007"},
            {addrType:"Shipping Address",country:"USA",state:"DC",city:"Washington",street:"813 Rosewood Lane", postalCode:"20007"},
          ]
        }
      }
    });
  }

  getAACReasons(){
    return Observable.of({
      reasons: [
        {value: 'Used for Ordering/Requisitioning Purposes', addrType:["Mailing Address", "Billing Address", "Shipping Address"]},
        {value: 'Used for Personal Property Reporting or Transfer', addrType:["Mailing Address", "Billing Address", "Shipping Address"]},
        {value: 'Used for Grants or Financial Assistance Reporting', addrType:["Mailing Address"]},
        {value: 'Used for Shipping Purposes', addrType:["Mailing Address", "Shipping Address"]},
        {value: 'Used for Billing Purposes', addrType:["Mailing Address", "Billing Address"]},
        {value: 'Used for Reporting with FPDS', addrType:["Mailing Address"]},
      ],
    });
  }

  postAACRequest(){}

}
