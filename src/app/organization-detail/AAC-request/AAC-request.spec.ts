import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { AACRequestPage } from "./AAC-request.component";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { SamTextComponent } from 'sam-ui-kit/form-controls/text/text.component';
import { LabelWrapper } from 'sam-ui-kit/wrappers/label-wrapper/label-wrapper.component';
import { AACRequestService } from 'api-kit/aac-request/aac-request.service.ts';

class AACRequestServiceStub{
  getAACRequestFormDetail(){
    return Observable.of(
      {"orgTypes": [{"orgTypeId": 1,"orgTypeName": "Federal Organization"},{"orgTypeId": 2,"orgTypeName": "State Organization"},{"orgTypeId": 3,"orgTypeName": "Contractor Organization"}],
        "requestAddressTypes": [
          {"requestAddressType": {"requestTypeId": 1,"requestTypeName": "Used for Ordering/Requisitioning Purposes"},"requestAddressMapping": [{"requestAddressId": 1,"requestTypeId": 1,"addressTypeId": 1,"addressTypeName": "Mailing Address"},{"requestAddressId": 2,"requestTypeId": 1,"addressTypeId": 2,"addressTypeName": "Shipping Address"},{"requestAddressId": 3,"requestTypeId": 1,"addressTypeId": 3,"addressTypeName": "Billing Address"}]},
          {"requestAddressType": {"requestTypeId": 2,"requestTypeName": "Used for Personal Property Reporting or Transfer"},"requestAddressMapping": [{"requestAddressId": 4,"requestTypeId": 2,"addressTypeId": 1,"addressTypeName": "Mailing Address"},{"requestAddressId": 5,"requestTypeId": 2,"addressTypeId": 2,"addressTypeName": "Shipping Address"},{"requestAddressId": 6,"requestTypeId": 2,"addressTypeId": 3,"addressTypeName": "Billing Address"}]},
          {"requestAddressType": {"requestTypeId": 3,"requestTypeName": "Used for Grants or Financial Assistance Reporting"},"requestAddressMapping": [{"requestAddressId": 7,"requestTypeId": 3,"addressTypeId": 1,"addressTypeName": "Mailing Address"}]},
          {"requestAddressType": {"requestTypeId": 4,"requestTypeName": "Used for Shipping Purposes"},"requestAddressMapping": [{"requestAddressId": 8,"requestTypeId": 4,"addressTypeId": 1,"addressTypeName": "Mailing Address"},{"requestAddressId": 9,"requestTypeId": 4,"addressTypeId": 2,"addressTypeName": "Shipping Address"}]},
          {"requestAddressType": {"requestTypeId": 5,"requestTypeName": "Used for Billing Purposes"},"requestAddressMapping": [{"requestAddressId": 10,"requestTypeId": 5,"addressTypeId": 1,"addressTypeName": "Mailing Address"},{"requestAddressId": 11,"requestTypeId": 5,"addressTypeId": 3,"addressTypeName": "Billing Address"}]},
          {"requestAddressType": {"requestTypeId": 6,"requestTypeName": "Used for Reporting with FPDS"},"requestAddressMapping": [{"requestAddressId": 12,"requestTypeId": 6,"addressTypeId": 1,"addressTypeName": "Mailing Address"}]}]
      }
    );
  }
}

describe('Create AAC Request Form Page', () => {
  // provide our implementations or mocks to the dependency injector
  let component:AACRequestPage;
  let fixture:any;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ AACRequestPage],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule, RouterTestingModule, AppComponentsModule ],
      providers: [
        {provide: AACRequestService, useClass: AACRequestServiceStub}
      ]
    });
    fixture = TestBed.createComponent(AACRequestPage);
    component = fixture.componentInstance;
  });

  it('should compile without error', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should be able to select single AAC request form', () => {
    fixture.detectChanges();
    component.aacTypeRadioModel = 'single';
    expect(component.isSingleAACRequest()).toBe(true);
  });

  it('should be able to fill in contractor org', () => {
    fixture.detectChanges();
    let contractorTypeName:any = '';
    component.aacOfficeConfig.options.forEach( e => {
      if(e.label.includes("Contract")) contractorTypeName = e.label;
    });
    component.aacTypeRadioModel = 'single';
    component.aacOfficeRadioModel = contractorTypeName;
    fixture.detectChanges();
    component.contractorForm.setValue({
      contractName: 'orgA',
      contractNum: '123',
      cageCode: '123',
      contractAdmin: 'admin',
      contractExpireDate: '2017-12-12',
    });
    expect(component.isOfficeInfoValid()).toBe(true);
    expect(component.generateRequestOfficeInfo()).toEqual([
      {desc:'Does an AAC exist for this organization', value: 'No'},
      {desc:'Is the request for a Federal Office, State/Local Office or Contractor', value: contractorTypeName},
      {desc:'Contractor Name', value: 'orgA'},
      {desc:'Contract Number', value: '123'},
      {desc:'CAGE Code', value: '123'},
      {desc:'Contract Administrator Name', value: 'admin'},
      {desc:'Contract Expiry Date', value: '2017-12-12'},
    ]);
    component.formatOfficeInfoError();
  });

  it('should be able to fill in state/local office org', () => {
    fixture.detectChanges();
    let stateTypeName:any = "";
    component.aacOfficeConfig.options.forEach( e => {
      if(e.label.includes("State")) stateTypeName = e.label;
    });
    component.aacTypeRadioModel = 'single';
    component.aacOfficeRadioModel = stateTypeName;
    fixture.detectChanges();
    component.stateOfficeForm.setValue({stateOfficeName:'orgA'});
    expect(component.isOfficeInfoValid()).toBe(true);
    expect(component.generateRequestOfficeInfo()).toEqual([
      {desc:'Does an AAC exist for this organization', value: 'No'},
      {desc:'Is the request for a Federal Office, State/Local Office or Contractor', value: stateTypeName},
      {desc:'Organization Name', value: 'orgA'},
    ]);
    component.formatOfficeInfoError();
  });

  it('should be able to fill in federal office org', () => {
    fixture.detectChanges();
    let federalTypeName:any = "";
    component.aacOfficeConfig.options.forEach( e => {
      if(e.label.includes("Federal")) federalTypeName = e.label;
    });

    component.aacTypeRadioModel = 'single';
    component.aacOfficeRadioModel = federalTypeName;
    fixture.detectChanges();
    component.formatOfficeInfoError();
    expect(component.aacFederalOrgNameErrorMsg).toBe('This field cannot be empty');
    component.getFederalOrgName({name:'orgA',value:'11111'});
    expect(component.isOfficeInfoValid()).toBe(true);
    expect(component.generateRequestOfficeInfo()).toEqual([
      {desc:'Does an AAC exist for this organization', value: 'No'},
      {desc:'Is the request for a Federal Office, State/Local Office or Contractor', value: federalTypeName},
      {desc:'Organization Name', value: 'orgA'},
    ]);
    component.formatOfficeInfoError();
    expect(component.aacFederalOrgNameErrorMsg).toBe('');
  });

  it('should be able to fill agency code and cacg code when fpds report reason is checked', () => {
    fixture.detectChanges();
    component.aacTypeRadioModel = 'single';
    component.aacOfficeRadioModel = 'Federal Office';
    expect(component.isReasonContainsFPDSReport()).toBe(false);
    component.formatReasonInfoError();
    expect(component.aacReasonCbxConfig.errorMessage).toBe('This field cannot be empty');
    component.aacReasonCbxModel.push("Used for Reporting with FPDS");

    fixture.detectChanges();
    expect(component.isReasonContainsFPDSReport()).toBe(true);
    component.fpdsReportForm.setValue({
      agencyCode: '12345',
      cgacCode: '12345',
    });
    expect(component.isReasonInfoValid()).toBe(true);
    component.formatReasonInfoError();
  });

  it('should have correct address form when select different aac reasons', () => {
    fixture.detectChanges();
    expect(component.isAddrTypeRequired("Billing Address")).toBe(false);
    expect(component.isAddrTypeRequired("Shipping Address")).toBe(false);
    component.aacReasonCbxModel = ["Used for Ordering/Requisitioning Purposes"];
    expect(component.isAddrTypeRequired("Billing Address")).toBe(true);
    expect(component.isAddrTypeRequired("Shipping Address")).toBe(true);

    component.aacReasonCbxModel = ["Used for Personal Property Reporting or Transfer"];
    expect(component.isAddrTypeRequired("Billing Address")).toBe(true);
    expect(component.isAddrTypeRequired("Shipping Address")).toBe(true);

    component.aacReasonCbxModel = ["Used for Grants or Financial Assistance Reporting"];
    expect(component.isAddrTypeRequired("Billing Address")).toBe(false);
    expect(component.isAddrTypeRequired("Shipping Address")).toBe(false);

    component.aacReasonCbxModel = ["Used for Shipping Purposes"];
    expect(component.isAddrTypeRequired("Billing Address")).toBe(false);
    expect(component.isAddrTypeRequired("Shipping Address")).toBe(true);

    component.aacReasonCbxModel = ["Used for Billing Purposes"];
    expect(component.isAddrTypeRequired("Billing Address")).toBe(true);
    expect(component.isAddrTypeRequired("Shipping Address")).toBe(false);

    component.aacReasonCbxModel = ["Used for Reporting with FPDS"];
    expect(component.isAddrTypeRequired("Billing Address")).toBe(false);
    expect(component.isAddrTypeRequired("Shipping Address")).toBe(false);
  });

  it('should update billing or shipping address when quick fill checkbox is checked', () => {
    fixture.detectChanges();
    component.mailAddr = {addrType:"Billing Address",country:"USA",state:"Virginia",city:"fairfax",street1:"street 123",street2:"",postalCode:"123456"};
    component.onDuplicateFillChecked("Billing Address",["same as mailing address"]);
    component.onDuplicateFillChecked("Shipping Address",["same as mailing address"]);
    expect(component.billAddr).toEqual({addrType:"Billing Address",country:"USA",state:"Virginia",city:"fairfax",street1:"street 123",street2:"",postalCode:"123456"});
    expect(component.shipAddr).toEqual({addrType:"Shipping Address",country:"USA",state:"Virginia",city:"fairfax",street1:"street 123",street2:"",postalCode:"123456"});
    component.onDuplicateFillChecked("Billing Address",[]);
    component.onDuplicateFillChecked("Shipping Address",[]);
    expect(component.billAddr).toEqual({addrType:"Billing Address",country:"",state:"",city:"",street1:"",street2:"",postalCode:""});
    expect(component.shipAddr).toEqual({addrType:"Shipping Address",country:"",state:"",city:"",street1:"",street2:"",postalCode:""});

  });

  it('should be able to review a correct aac request form', () => {
    fixture.detectChanges();
    component.aacTypeRadioModel = 'single';
    component.aacOfficeRadioModel = 'Federal Office';
    component.getFederalOrgName({name:'orgA',value:'11111'});
    expect(component.isOfficeInfoValid()).toBe(true);
    component.aacReasonCbxModel = ['Used for Personal Property Reporting or Transfer'];
    component.addrForms.forEach(e => {
      e.stateLocationConfig.serviceOptions = {value:"United States", key:"USA"};
      e.stateOutput = {value:"Virginia"};
      e.addressForm.get("streetAddr1").setValue("street 123");
      e.addressForm.get("postalCode").setValue("123456");
      e.addressForm.get("city").setValue("fairfax");
    });
    component.onReviewAACRequestClick();
    component.onEditFormClick();
  });

});
