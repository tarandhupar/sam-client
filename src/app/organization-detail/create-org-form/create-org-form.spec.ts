import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { OrgCreateForm } from "./create-org-form.component";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { FlashMsgService } from "../flash-msg-service/flash-message.service";
import { FHService } from "../../../api-kit/fh/fh.service";
import { LocationService } from "../../../api-kit/location/location.service";

class LocationServiceStub {
  validateZipWIthLocation(zip:string, state?:any, city?:any):any{
    return Observable.of({description:'VALID'});
  }
};

class FHServiceStub {
  createOrganization(orgObj, parentPath, parentPathName){return Observable.of({});}
  updateOrganization(orgObj,isMove){return Observable.of({});}
  getOrganizationById(orgId:string, childHierarchy:boolean, parentHierarchy:boolean):any{
    return  Observable.of(
      {_embedded:
        [{org:
        {
          categoryDesc: "SUB COMMAND",
          categoryId: "CAT-6",
          code: "RMAC",
          createdBy: "DODMIGRATOR",
          createdDate: 1053388800000,
          description: "RMAC",
          fpdsOrgId: "RMAC",
          fullParentPath: "100000000.100000012.100000117.100000120",
          fullParentPathName: "DEPT_OF_DEFENSE.DEPT_OF_THE_ARMY.AMC.RMAC",
          isSourceFpds: true,
          l1Name: "DEPT OF DEFENSE",
          l1OrgKey: 100000000,
          l2Name: "DEPT OF THE ARMY",
          l3Name: "AMC",
          l4Name: "RMAC",
          lastModifiedBy: "FPDSADMIN",
          lastModifiedDate: 1161993600000,
          level: 4,
          name: "RMAC",
          orgCode: "ORG-2899",
          orgKey: 100000120,
          parentOrg: "AMC",
          parentOrgKey: 100000117,
          type: "SUB COMMAND",
          orgAddresses:[]
        }
        }]
      }
    );
  }
};

describe('Create Organization Form Component', () => {
  // provide our implementations or mocks to the dependency injector
  let component:OrgCreateForm;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgCreateForm ],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule, RouterTestingModule, AppComponentsModule ],
      providers: [
        FlashMsgService,
        { provide: Router,  useValue:{events:Observable.of({url:"/create-organization"}), navigate:(navigateDetail)=>{return navigateDetail;}} },
        { provide: ActivatedRoute, useValue: {'queryParams': Observable.from([{ 'orgType': 'Office',  'parentID': '100000000',}])}},
        { provide: FHService ,useClass:FHServiceStub},
        { provide: LocationService ,useClass:LocationServiceStub},
      ]
    });
    fixture = TestBed.createComponent(OrgCreateForm);
    component = fixture.componentInstance;
    component.orgFormConfig = {
      mode: 'create',
      parentId: '100000000',
      orgType: 'office'
    }
  });

  it('should compile without error', () => {
    component.orgFormConfig = {
      mode: 'create',
      orgType: 'department'
    };
    fixture.detectChanges();
    expect(component.isAddressNeeded()).toBeFalsy();
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
      e.cityLocationConfig.serviceOptions.country = {value:"United States", key:"USA"};
      e.cityLocationConfig.serviceOptions.state = {value:"Virginia", key:"VA"};
      e.cityOutput = {value:"fairfax"};
      e.addressForm.get("streetAddr1").setValue("street 123");
      e.addressForm.get("postalCode").setValue("22030");
    });
    component.onReviewFormClick();
    expect(component.reviewOrgPage).toBeTruthy();
    expect(component.createOrgPage).toBeFalsy();
    expect(component.orgInfo).toEqual([
      { des: 'Organization Name', value: 'OrgA' },
      { des: 'Start Date', value: '2016-12-12' },
      { des: 'End Date', value: '' },
      { des: 'Description', value: 'OrgA' },
      { des: 'Shortname', value: 'OrgA' },
      { des: 'Indicate Funding', value: 'other'},
      { des: 'FPDS Code', value: 'FPDS' },
      { des: 'AAC Code', value: '' }
    ]);
    component.onEditFormClick();
    expect(component.reviewOrgPage).toBeFalsy();
    expect(component.createOrgPage).toBeTruthy();
    component.onConfirmFormClick();
  });

  xit('should be able to set up create department codes form', () => {
    fixture.detectChanges();
    component.orgType = "Department";
    component.setupOrgForms(component.orgType);
    component.deptCodesForm.get('FPDSCode').setValue("FPDS");
    component.deptCodesForm.get('TAS2Code').setValue("TAS2Code");
    component.deptCodesForm.get('TAS3Code').setValue("TAS3Code");
    component.getOrgTypeSpecialInfo(component.orgType);
    expect(component.orgInfo).toEqual([{ des: 'FPDS Code', value: 'FPDS' },{ des: 'TAS2 Code', value: 'TAS2Code' },{ des: 'TAS3 Code', value: 'TAS3Code' },
      { des: 'A11 Code', value: '' }, { des: 'CFDA Code', value: '' }, { des: 'OMB Agency Code', value: '' }]);

  });

  it('should be able to set edit mode for organization', () => {
    component.orgFormConfig = {
      mode: 'update',
      parentId: '100000012',
      endDate: '2017-01-01',
      org: {
        categoryDesc: "Office",
        categoryId: "CAT-6",
        code: "RMAC",
        createdBy: "DODMIGRATOR",
        createdDate: 1053388800000,
        description: "RMAC",
        fpdsOrgId: "RMAC",
        fullParentPath: "100000000.100000012.100000117",
        fullParentPathName: "DEPT_OF_DEFENSE.DEPT_OF_THE_ARMY.AMC",
        isSourceFpds: true,
        l1Name: "DEPT OF DEFENSE",
        l1OrgKey: 100000000,
        l2Name: "DEPT OF THE ARMY",
        l3Name: "AMC",
        lastModifiedBy: "FPDSADMIN",
        lastModifiedDate: 1161993600000,
        level: 3,
        name: "AMC",
        orgCode: "ORG-2899",
        orgKey: 100000120,
        parentOrg: "AMC",
        parentOrgKey: 100000117,
        type: "Office",
        orgAddresses:[]
      }
    };
    fixture.detectChanges();
    component.generateBasicOrgObj();
    component.onConfirmFormClick();
  });
});
