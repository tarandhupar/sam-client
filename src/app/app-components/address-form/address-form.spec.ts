import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import * as moment from 'moment/moment';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { SamTextComponent } from 'sam-ui-kit/form-controls/text/text.component';
import { LabelWrapper } from 'sam-ui-kit/wrappers/label-wrapper/label-wrapper.component';

// Load the implementations that should be tested
import { OrgAddrFormComponent } from "./address-form.component.ts";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { FHService } from "../../../api-kit/fh/fh.service.ts";

describe('Organization Address Form component', () => {
  // provide our implementations or mocks to the dependency injector
  let component:OrgAddrFormComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgAddrFormComponent],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule ],
      providers: [
        LabelWrapper , SamTextComponent
      ]
    });
    fixture = TestBed.createComponent(OrgAddrFormComponent);
    component = fixture.componentInstance;
  });

  it('should compile without error', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should be able to select a address type', () => {
    fixture.detectChanges();
    component.orgAddrModel = {addrType:"",country:"",state:"",city:"",street:"",postalCode:""};
    expect(component.isOrgTypeSelected()).toBeFalsy();
    component.onAddrTypeSelect("Billing Address");
    expect(component.isOrgTypeSelected()).toBeTruthy();
    expect(component.isBasicAddressType()).toBeFalsy();
  });

  it('should be able to validate a correct form', () => {
    fixture.detectChanges();
    component.orgAddrModel = {addrType:"Mailing Address",country:"",state:"",city:"",street:"",postalCode:""};
    expect(component.isOrgTypeSelected()).toBeTruthy();
    component.stateLocationConfig.serviceOptions = {value:"United States", key:"USA"};
    component.stateOutput = {value:"Virginia"};
    component.addressForm.get("streetAddr1").setValue("street 123");
    component.addressForm.get("postalCode").setValue("123456");
    component.addressForm.get("city").setValue("fairfax");
    expect(component.validateForm()).toBeTruthy();
    expect(component.orgAddrModel).toEqual({addrType:"Mailing Address",country:"USA",state:"Virginia",city:"fairfax",street:"street 123",postalCode:"123456"});
  });

  it('should be able to validate a invalid form', () => {
    fixture.detectChanges();
    component.orgAddrModel = {addrType:"Mailing Address",country:"",state:"",city:"",street:"",postalCode:""};
    expect(component.isOrgTypeSelected()).toBeTruthy();
    component.addressForm.get("streetAddr1").setValue("street 123");
    component.addressForm.get("postalCode").setValue("123456");
    component.addressForm.get("city").setValue("fairfax");
    expect(component.validateForm()).toBeFalsy();
    expect(component.addrState.errorMessage).toBe("This field cannot be empty");
    expect(component.addrCountry.errorMessage).toBe("This field cannot be empty");
  });


});
