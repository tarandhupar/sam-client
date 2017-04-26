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
    component.aacTypeRadioModel = 'single';
    component.aacOfficeRadioModel = 'Contractor Office';
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
      {desc:'Is the request for a Federal Office, State/Local Office or Contractor', value: 'Contractor Office'},
      {desc:'Contractor Name', value: 'orgA'},
      {desc:'Contract Number', value: '123'},
      {desc:'CAGE Code', value: '123'},
      {desc:'Contract Administrator Name', value: 'admin'},
      {desc:'Contract Expiry Date', value: '2017-12-12'},
    ]);
    component.formatOfficeInfoError();
  });

  it('should be able to fill in state/local office org', () => {
    component.aacTypeRadioModel = 'single';
    component.aacOfficeRadioModel = 'State/Local Office';
    fixture.detectChanges();
    component.stateOfficeForm.setValue({stateOfficeName:'orgA'});
    expect(component.isOfficeInfoValid()).toBe(true);
    expect(component.generateRequestOfficeInfo()).toEqual([
      {desc:'Does an AAC exist for this organization', value: 'No'},
      {desc:'Is the request for a Federal Office, State/Local Office or Contractor', value: 'State/Local Office'},
      {desc:'Organization Name', value: 'orgA'},
    ]);
    component.formatOfficeInfoError();
  });

  it('should be able to fill in federal office org', () => {
    component.aacTypeRadioModel = 'single';
    component.aacOfficeRadioModel = 'Federal Office';
    fixture.detectChanges();
    component.formatOfficeInfoError();
    expect(component.aacFederalOrgNameErrorMsg).toBe('This field cannot be empty');
    component.getFederalOrgName({name:'orgA',value:'11111'});
    expect(component.isOfficeInfoValid()).toBe(true);
    expect(component.generateRequestOfficeInfo()).toEqual([
      {desc:'Does an AAC exist for this organization', value: 'No'},
      {desc:'Is the request for a Federal Office, State/Local Office or Contractor', value: 'Federal Office'},
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
