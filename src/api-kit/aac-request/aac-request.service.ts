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
    //   suffix: '/'+requestId,
    //   method: 'GET',
    //   oParam: {}
    // };
    //
    // return this.apiService.call(apiOptions);
    return Observable.of({
      "aac": {
        "aacId": 1,"orgTypeId": 2,"orgName": "ABC","contractNumber": null,"cageCode": null,"contractExpiryDate": null,
        "aacExists": true,"requestorEmailId": "nithin@gsa.gov","aacLink": "/test",
        "createdBy": "admin","createdDate": "2017-04-25T21:55:48.695-0400",
        "lastModifiedBy": "admin","lastModifiedDate": "2017-04-25T21:55:48.695-0400",
        "orgTypeName": "State Organization","contractAdminName": null
      },
      "addressList": [
        {"addressId": 4,"aacId": 1,"addressTypeId": 1,"street1": "Eisenhover","street2": null,"code": "20170","state": "Virginia","city": "Alexandria","country": "USA","addressTypeName": "Mailing Address"},
        {"addressId": 5,"aacId": 1,"addressTypeId": 2,"street1": "Internation Drive","street2": null,"code": "20170","state": "Virginia","city": "McLean","country": "USA","addressTypeName": "Shipping Address"}
      ],
      "requestReasonList": [
        {"requestReasonId": 1,"aacId": 1,"requestTypeId": 1,"requestReasonName": "Used for Ordering/Requistioning Purposes"},
        {"requestReasonId": 2,"aacId": 1,"requestTypeId": 2,"requestReasonName": "Used for Personal Property Reporting or Transfer"}
      ]
    });
  }

  getAACRequestFormDetail(){
    // let apiOptions: any = {
    //   name: 'aac',
    //   suffix: '',
    //   method: 'GET',
    //   oParam: {}
    // };
    //
    // return this.apiService.call(apiOptions);
    return Observable.of(
    {"orgTypes": [{"orgTypeId": 1,"orgTypeName": "Federal Organization"},{"orgTypeId": 2,"orgTypeName": "State Organization"},{"orgTypeId": 3,"orgTypeName": "Contractor Organization"}],
      "requestAddressTypes": [
        {"requestAddressType": {"requestTypeId": 1,"requestTypeName": "Used for Ordering/Requistioning Purposes"},"requestAddressMapping": [{"requestAddressId": 1,"requestTypeId": 1,"addressTypeId": 1,"addressTypeName": "Mailing Address"},{"requestAddressId": 2,"requestTypeId": 1,"addressTypeId": 2,"addressTypeName": "Shipping Address"},{"requestAddressId": 3,"requestTypeId": 1,"addressTypeId": 3,"addressTypeName": "Billing Address"}]},
        {"requestAddressType": {"requestTypeId": 2,"requestTypeName": "Used for Personal Property Reporting or Transfer"},"requestAddressMapping": [{"requestAddressId": 4,"requestTypeId": 2,"addressTypeId": 1,"addressTypeName": "Mailing Address"},{"requestAddressId": 5,"requestTypeId": 2,"addressTypeId": 2,"addressTypeName": "Shipping Address"},{"requestAddressId": 6,"requestTypeId": 2,"addressTypeId": 3,"addressTypeName": "Billing Address"}]},
        {"requestAddressType": {"requestTypeId": 3,"requestTypeName": "Used for Grants or Financial Assistance Reporting"},"requestAddressMapping": [{"requestAddressId": 7,"requestTypeId": 3,"addressTypeId": 1,"addressTypeName": "Mailing Address"}]},
        {"requestAddressType": {"requestTypeId": 4,"requestTypeName": "Used for Shipping Purposes"},"requestAddressMapping": [{"requestAddressId": 8,"requestTypeId": 4,"addressTypeId": 1,"addressTypeName": "Mailing Address"},{"requestAddressId": 9,"requestTypeId": 4,"addressTypeId": 2,"addressTypeName": "Shipping Address"}]},
        {"requestAddressType": {"requestTypeId": 5,"requestTypeName": "Used for Billing Purposes"},"requestAddressMapping": [{"requestAddressId": 10,"requestTypeId": 5,"addressTypeId": 1,"addressTypeName": "Mailing Address"},{"requestAddressId": 11,"requestTypeId": 5,"addressTypeId": 3,"addressTypeName": "Billing Address"}]},
        {"requestAddressType": {"requestTypeId": 6,"requestTypeName": "Used for Reporting with FPDS"},"requestAddressMapping": [{"requestAddressId": 12,"requestTypeId": 6,"addressTypeId": 1,"addressTypeName": "Mailing Address"}]}]
    }
    );
  }

  postAACRequest(aacObj){
    console.log(aacObj);
    // let apiOptions: any = {
    //   name: 'aac',
    //   suffix: '',
    //   method: 'POST',
    //   body: aacObj,
    //   oParam: {}
    // };
    //
    // return this.apiService.call(apiOptions);
    return Observable.of({});
  }

}
