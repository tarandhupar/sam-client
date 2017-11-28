import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import * as moment from 'moment/moment';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { SamTextComponent } from 'sam-ui-elements/src/ui-kit/form-controls/text/text.component';
import { LabelWrapper } from 'sam-ui-elements/src/ui-kit/wrappers/label-wrapper/label-wrapper.component';

// Load the implementations that should be tested
import { OrgAddrFormComponent } from "./address-form.component";
import { SamLocationComponent } from "../location-component";
import { SamUIKitModule } from "sam-ui-elements/src/ui-kit";
import { SamAPIKitModule } from "api-kit";
import { LocationService } from "api-kit/location/location.service";

class LocationServiceStub {
  searchCountry(type,country){
    return Observable.of({
        _embedded:{
            countryList: [
                {
                    country: "aaaa"
                }
            ]
        }
    });
  };
  searchState(type, state, country){
    return Observable.of({
        _embedded:{
            stateList: [
                {
                    state: "bbbb"
                }
            ]
        }
    });
  };
  searchCity(){
    return Observable.of({
        _embedded:{
            cityList: [
                {
                    cityCode: "cccc"
                }
            ]
        }
    });
  };
  validateZipWIthLocation(zip:string, state?:any, city?:any):any{
    return Observable.of({description:'VALID'});
  };
};

describe('Organization Address Form component', () => {
  // provide our implementations or mocks to the dependency injector
  let component:OrgAddrFormComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgAddrFormComponent, SamLocationComponent ],
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

  it("should populate address", ()=>{
    component.orgAddrModel = {addrType:"",country:"aaa",state:"bbb",city:"ccc",street1:"",street2:"",postalCode:"", zip:""};
    component.populateAddressFormField();
    expect(component.locationObj["city"]["value"]).toBe("ccc,bbb");
  });

  it("should have event emitters for clicks", ()=>{
    component.onAdditionalAddrRequest.subscribe(val=>{
        expect(val).toBe(true);
    });
    component.onCancelAdditionalAddrRequest.subscribe(val=>{
        expect(val['addrType']).toBe("aaa");
    });
    component.onAdditionalAddressFormClick(null);
    component.orgAddrModel = {addrType:"aaa",country:"",state:"",city:"",street1:"",street2:"",postalCode:""};;
    component.onCancelAddressFormClick();
  });

  it("should validate", ()=>{
    component.orgAddrModel = {addrType:"",country:"aaa",state:"bbb",city:"ccc",street1:"aaaa",street2:"",postalCode:"", zip:""};
    fixture.detectChanges();
    component.validateForm().subscribe(val=>{
        expect(val['description']).toBe("INVALID");
    });
  });
});
