import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { OrgCreatePage } from "./create-org.component";
import { OrgCreateForm } from "../create-org-form/create-org-form.component";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { FlashMsgService } from "../flash-msg-service/flash-message.service";
import { FHService } from "api-kit/fh/fh.service";
import { LocationService } from "api-kit/location/location.service";

class LocationServiceStub {
  validateZipWIthLocation(zip:string, state?:any, city?:any):any{
    return Observable.of({description:'VALID'});
  }
};

class FHServiceStub {
  getAccess(orgId){return Observable.of({});}
  getOrganizationDetail(orgId){return Observable.of(
  {
    _embedded:[
      {
        org: {
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
      },
      {
        _links:[
          {
            link:{
              rel:'sub-tier',
              method: 'POST',
            }
          }
        ]
      }
    ]
  }
);}
};

fdescribe('Create Organization Page', () => {
  // provide our implementations or mocks to the dependency injector
  let component:OrgCreatePage;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgCreatePage, OrgCreateForm ],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule, RouterTestingModule, AppComponentsModule ],
      providers: [
        FlashMsgService,
        { provide: Router,  useValue:{events:Observable.of({url:"/create-organization"}), navigateByUrl:(url)=>{return url;}} },
        { provide: ActivatedRoute, useValue: {'queryParams': Observable.from([{ 'orgType': 'Office',  'parentID': '100000000',}])}},
        { provide: FHService ,useClass:FHServiceStub},
        { provide: LocationService ,useClass:LocationServiceStub},
      ]
    });
    fixture = TestBed.createComponent(OrgCreatePage);
    component = fixture.componentInstance;
  });

  it('should compile without error', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });


});
