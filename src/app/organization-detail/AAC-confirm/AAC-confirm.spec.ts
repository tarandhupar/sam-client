import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { AACConfirmPage } from "./AAC-confirm.component";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { AACRequestService } from 'api-kit/aac-request/aac-request.service.ts';

class AACRequestServiceStub{
  getAACRequestDetail(){
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
}

describe('Create AAC Confirm Form Page', () => {
  // provide our implementations or mocks to the dependency injector
  let component:AACConfirmPage;
  let fixture:any;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ AACConfirmPage],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule, RouterTestingModule, AppComponentsModule ],
      providers: [
        { provide: ActivatedRoute, useValue: {'params': Observable.of({ 'requestId': '1'})}},
        { provide: AACRequestService, useClass: AACRequestServiceStub},
      ]
    });
    fixture = TestBed.createComponent(AACConfirmPage);
    component = fixture.componentInstance;
  });

  it('should compile without error', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should contain FPDS Report in the reasons for aac request', () => {
    fixture.detectChanges();
    expect(component.isReasonContainsFPDSReport()).toBe(false);
  });

  it('should have correct fields set for Federal Office AAC request', () => {
    fixture.detectChanges();
    let federalOfficeInfo = component.generateRequestOfficeInfo({
      "aacId": 1,"orgTypeId": 2,"orgName": "Temp Federal Office","contractNumber": null,"cageCode": null,"contractExpiryDate": null,
      "aacExists": false,"requestorEmailId": "nithin@gsa.gov","aacLink": "/test",
      "createdBy": "admin","createdDate": "2017-04-25T21:55:48.695-0400",
      "lastModifiedBy": "admin","lastModifiedDate": "2017-04-25T21:55:48.695-0400",
      "orgTypeName": "Federal Office","contractAdminName": null
    });
    expect(federalOfficeInfo).toEqual([
      {desc:'Does an AAC exist for this organization',value:false},
      {desc:'Is the request for a Federal Office, State/Local Office or Contractor',value:"Federal Office"},
      {desc:'Organization Name',value:"Temp Federal Office"},
    ]);
  });

});
