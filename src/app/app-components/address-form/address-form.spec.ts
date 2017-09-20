import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import * as moment from 'moment/moment';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { SamTextComponent } from 'sam-ui-kit/form-controls/text/text.component';
import { LabelWrapper } from 'sam-ui-kit/wrappers/label-wrapper/label-wrapper.component';

// Load the implementations that should be tested
import { OrgAddrFormComponent } from "./address-form.component";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { LocationService } from "api-kit/location/location.service";

class LocationServiceStub {
  validateZipWIthLocation(zip:string, state?:any, city?:any):any{
    return Observable.of({description:'VALID'});
  }
};

xdescribe('Organization Address Form component', () => {
  // provide our implementations or mocks to the dependency injector
  let component:OrgAddrFormComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgAddrFormComponent],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule ],
      providers: [
        {provide:LocationService, useClass:LocationServiceStub}
      ]
    });
    fixture = TestBed.createComponent(OrgAddrFormComponent);
    component = fixture.componentInstance;
  });

  it('should compile without error', () => {
    component.orgAddrModel = {addrType:"Mailing Address",country:"",state:"",city:"",street1:"",street2:"",postalCode:""};
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should be able to select a address type', () => {
    component.orgAddrModel = {addrType:"",country:"",state:"",city:"",street1:"",street2:"",postalCode:""};
    fixture.detectChanges();
    expect(component.isOrgTypeSelected()).toBeFalsy();
    component.onAddrTypeSelect("Billing Address");
    expect(component.isOrgTypeSelected()).toBeTruthy();
    expect(component.isBasicAddressType()).toBeFalsy();
  });

  //is the logic to make 'fairfax' to 'fai' correct?
  xit('should be able to validate a correct form', () => {
    component.orgAddrModel = {addrType:"Mailing Address",country:"",state:"",city:"",street1:"",street2:"",postalCode:""};
    fixture.detectChanges();
    expect(component.isOrgTypeSelected()).toBeTruthy();
    component.cityLocationConfig.serviceOptions.country = {value:"United States", key:"USA"};
    component.cityLocationConfig.serviceOptions.state = {value:"Virginia", key:"VA"};
    component.cityOutput = {value:"fairfax"};
    component.addressForm.get("streetAddr1").setValue("street 123");
    component.addressForm.get("postalCode").setValue("22030");
    component.validateForm();
    component.updateCityField({value:"fairfax"});
    expect(component.orgAddrModel).toEqual({addrType:"Mailing Address",country:"USA",state:"",city:"fairfax",street1:"street 123",street2:"",postalCode:"22030"});

  });

  it('should be able to validate a invalid form', () => {
    component.orgAddrModel = {addrType:"Mailing Address",country:"",state:"",city:"",street1:"",street2:"",postalCode:""};
    fixture.detectChanges();
    expect(component.isOrgTypeSelected()).toBeTruthy();
    component.addressForm.get("streetAddr1").setValue("street 123");
    component.addressForm.get("postalCode").setValue("22030");
    component.validateForm();
    expect(component.addrState.errorMessage).toBe("This field cannot be empty");
    expect(component.addrCountry.errorMessage).toBe("This field cannot be empty");
  });


});
