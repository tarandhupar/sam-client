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
      _embedded: {
        aac: {
          requestId: 1,
          isAACExist: false,
          orgName: "Form Supply Management",
          aacType: "Contractor Office",
          requestReasons: ["Used for Ordering/Requisitioning Purposes", "Used for Reporting with FPDS"],
          agencyCode: "ABC",
          cgacCode: "ABC",
          contractorName: "Temp Contractor",
          contractNum: "DOC123456",
          cageCode: "123456",
          contractAdmin: "Jane Doe",
          contractExpireDate: "2017-12-12",
          orgAddresses: [
            {
              addrType: "Mailing Address",
              country: "USA",
              state: "DC",
              city: "Washington",
              street: "813 Rosewood Lane",
              postalCode: "20007"
            },
            {
              addrType: "Billing Address",
              country: "USA",
              state: "DC",
              city: "Washington",
              street: "813 Rosewood Lane",
              postalCode: "20007"
            },
            {
              addrType: "Shipping Address",
              country: "USA",
              state: "DC",
              city: "Washington",
              street: "813 Rosewood Lane",
              postalCode: "20007"
            },
          ]
        }
      }
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
    expect(component.isReasonContainsFPDSReport()).toBe(true);
  });

  it('should have correct fields set for Federal Office AAC request', () => {
    fixture.detectChanges();
    let federalOfficeInfo = component.generateRequestOfficeInfo(
      {
        requestId: 1,
        isAACExist: false,
        orgName: "Form Supply Management",
        aacType: "Federal Office",
        requestReasons: ["Used for Ordering/Requisitioning Purposes", "Used for Reporting with FPDS"],
        agencyCode: "ABC",
        cgacCode: "ABC",
        organizationName: "Temp Federal Office",
      }
    );
    expect(federalOfficeInfo).toEqual([
      {desc:'Does an AAC exist for this organization',value:false},
      {desc:'Is the request for a Federal Office, State/Local Office or Contractor',value:"Federal Office"},
      {desc:'Organization Name',value:"Temp Federal Office"},
    ]);
  });

  it('should have correct fields set for State/Local Office AAC request', () => {
    fixture.detectChanges();
    let federalOfficeInfo = component.generateRequestOfficeInfo(
      {
        requestId: 1,
        isAACExist: true,
        orgName: "Form Supply Management",
        aacType: "State/Local Office",
        requestReasons: ["Used for Ordering/Requisitioning Purposes", "Used for Reporting with FPDS"],
        agencyCode: "ABC",
        cgacCode: "ABC",
        organizationName: "Temp State Office",
      }
    );
    expect(federalOfficeInfo).toEqual([
      {desc:'Does an AAC exist for this organization',value:true},
      {desc:'Is the request for a Federal Office, State/Local Office or Contractor',value:"State/Local Office"},
      {desc:'Organization Name',value:"Temp State Office"},
    ]);
  });
});
