import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { OrgCreatePage } from "./create-org.component";
import { OrgAddrFormComponent } from "./address-form/address-form.component";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";


describe('Create Organization Form Page', () => {
  // provide our implementations or mocks to the dependency injector
  let component:OrgCreatePage;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgCreatePage, OrgAddrFormComponent],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule, RouterTestingModule ],
      providers: [
        { provide: Router,  useValue:{events:Observable.of({url:"/create-organization"})} },
        { provide: ActivatedRoute, useValue: {'queryParams': Observable.from([{ 'orgType': 'Office',  'parentID': '100000000',}])}},
      ]
    });
    fixture = TestBed.createComponent(OrgCreatePage);
    component = fixture.componentInstance;
  });

  it('should compile without error', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should have correct fields for Office organization creation', () => {
    fixture.detectChanges();
    expect(component.isAddressNeeded()).toBeTruthy();
    expect(component.officeCodesForm.get("FPDSCode").value).toBe("");
    expect(component.officeCodesForm.get("ACCCode").value).toBe("");
  });

  it('should be able to set up values and add or delete address form', () => {
    fixture.detectChanges();
    component.setOrgStartDate("2016-12-12");
    component.onAddAddressForm();
    expect(component.orgAddresses.length).toBe(2);
    component.onDeleteAddressForm(component.orgAddresses[1].addrModel);
    expect(component.orgAddresses.length).toBe(1);
    expect(component.isAddressFormValid()).toBeFalsy();
  });

  it('should be able to validate an empty create organization form', () => {
    fixture.detectChanges();
    component.onReviewFormClick();
    expect(component.createOrgPage).toBeTruthy();
    expect(component.reviewOrgPage).toBeFalsy();
  });

  it('should be able to validate an valid create organization form', () => {
    fixture.detectChanges();
    component.basicInfoForm.get('orgName').setValue("OrgA");
    component.setOrgStartDate("2016-12-12");
    component.basicInfoForm.get('orgDescription').setValue("OrgA");
    component.basicInfoForm.get('orgShortName').setValue("OrgA");
    component.officeCodesForm.get('FPDSCode').setValue("FPDS");
    component.indicateFundRadioModel = "other";
    component.addrForms.forEach(e=>{
      e.stateLocationConfig.serviceOptions = {value:"United States", key:"USA"};
      e.stateOutput = {value:"Virginia"};
      e.addressForm.get("streetAddr1").setValue("street 123");
      e.addressForm.get("postalCode").setValue("123456");
      e.addressForm.get("city").setValue("fairfax");
    });
    component.onReviewFormClick();
    expect(component.reviewOrgPage).toBeTruthy();
    expect(component.createOrgPage).toBeFalsy();
    expect(component.orgInfo).toEqual([{ des: 'Organization Name', value: 'OrgA' }, { des: 'Start Date', value: '2016-12-12' }, { des: 'Description', value: 'OrgA' }, { des: 'Shortname', value: 'OrgA' },
      { des: 'Indicate Funding', value: 'other' }, { des: 'FPDS Code', value: 'FPDS' }, { des: 'AAC Code', value: '' }]);
    component.onEditFormClick();
    expect(component.reviewOrgPage).toBeFalsy();
    expect(component.createOrgPage).toBeTruthy();
  });

  it('should be able to set up create department codes form', () => {
    fixture.detectChanges();
    component.orgType = "Department";
    component.setupOrgForms(component.orgType);
    component.deptCodesForm.get('FPDSCode').setValue("FPDS");
    component.deptCodesForm.get('TAS2Code').setValue("TAS2Code");
    component.deptCodesForm.get('TAS3Code').setValue("TAS3Code");
    component.getOrgTypeSpecialInfo(component.orgType);
    expect(component.orgInfo).toEqual([{ des: 'FPDS Code', value: 'FPDS' },{ des: 'TAS2 Code', value: 'TAS2Code' },{ des: 'TAS3 Code', value: 'TAS3Code' },
      { des: 'A11 Code', value: '' }, { des: 'CFDA Code', value: '' }, { des: 'OMB Agency Code', value: '' }]);
  })
});
