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
import { OrgCreatePage } from "./create-org.component";
import { OrgAddrFormComponent } from "./address-form/address-form.component";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { OrganizationDetailModule } from "../organization-detail.module";

class RouterStub {
  navigate(url: string) { return url; }
}

fdescribe('Create Organization Form Page', () => {
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


});
