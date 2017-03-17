import {
  inject,
  TestBed
} from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

// Load the implementations that should be tested
import { OrgDetailProfilePage } from "./profile.component";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import {FHService} from "../../../api-kit/fh/fh.service";

class RouterStub {
  navigate(url: string) { return url; }
}

class FHServiceStub {

  getOrganizationById(orgId:string, childHierarchy:boolean, parentHierarchy:boolean):any{
    return orgId === "100000120"?  Observable.of(
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
    ):
      Observable.of(
        {_embedded:
          [{org:
            {
              "orgKey": 100000121,
              "contractingOfficeEndDate": 1064880000000,
              "contractingOfficeId": "CO-49381",
              "contractingOfficeStartDate": 1001894400000,
              "createdBy": "DODMIGRATOR",
              "createdDate": 1053388800000,
              "endDate": 1096502400000,
              "fpdsOrgId": "AD21",
              "fullParentPath": "100000000.100000012.100000117.100000120.100000121",
              "fullParentPathName": "DEPT_OF_DEFENSE.DEPT_OF_THE_ARMY.AMC.RMAC.US_ARMY_ROBERT_MORRIS_ACQUISITIO",
              "governmentOfficeId": "GOV-10008",
              "ingestedOn": 1464000601909,
              "isSourceFpds": true,
              "lastModifiedBy": "FPDSADMIN",
              "lastModifiedDate": 1162049389000,
              "modStatus": "inactive",
              "name": "US ARMY ROBERT MORRIS ACQUISITIO",
              "newIsAward": true,
              "newIsFunding": true,
              "parentOrgKey": 100000120,
              "startDate": 970358400000,
              "type": "OFFICE",
              "level": 5,
              "code": "AD21",
              "orgAddresses": [
              {
                "addressKey": 50000104,
                "city": "PINE BLUFF",
                "countryCode": "USA",
                "createdBy": "DODMIGRATOR",
                "createdDate": 1053388800000,
                "isSourceFpds": true,
                "lastModifiedBy": "FPDSADMIN",
                "lastModifiedDate": 1162049389000,
                "modStatus": "inactive",
                "state": "AR",
                "streetAddress": "10020 KABRICH CIRCLE",
                "zipcode": "716029500"
              }
            ],
              "hierarchy": [],
              "parentOrg": "RMAC",
              "l1Name": "DEPT OF DEFENSE",
              "l2Name": "DEPT OF THE ARMY",
              "l3Name": "AMC",
              "l4Name": "RMAC",
              "l5Name": "US ARMY ROBERT MORRIS ACQUISITIO",
              "l1OrgKey": 100000000
            }
          }]
        }
      );
  }
};

let activatedRouteStub = {
  snapshot: {
    _lastPathIndex: 0,
  },
  parent: {
    snapshot: {
      params: { orgId: "100000121"}
    }
  },
  queryParams: {
    subscribe: function() { }
  }
};

describe('Organization Detail Profile Page', () => {
  // provide our implementations or mocks to the dependency injector
  let component:OrgDetailProfilePage;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgDetailProfilePage ],
      imports:[ SamUIKitModule, SamAPIKitModule, RouterTestingModule],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub},
        { provide: FHService ,useClass:FHServiceStub}
      ]
    });
    fixture = TestBed.createComponent(OrgDetailProfilePage);
    component = fixture.componentInstance;
  });

  it('should compile without error', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should have correct parameters and next layer text', () => {
    fixture.detectChanges();
    fixture.detectChanges();
    expect(component.getNextLayer()).toBe("Office");
    expect(component.currentHierarchyType).toBe("Office");
    expect(component.orgDetails).toEqual([
      {description:"Office Name", value:"Us Army Robert Morris Acquisitio"},
      {description:"Description", value:""},
      {description:"Shortname", value:""},
      {description:"Start Date", value:"09/30/2000"},
      {description:"Indicate Funding", value:"Funding/Award"},
    ]);
  });

  it('should switch to correct organization details if click on the link', () => {
    fixture.detectChanges();
    component.onChangeOrgDetail("RMAC");
    expect(component.getNextLayer()).toBe("Office");
    expect(component.currentHierarchyType).toBe("Sub Command");
    expect(component.orgDetails).toEqual([
      {description:"Sub Command Name", value:"Rmac"},
      {description:"Description", value:""},
      {description:"Shortname", value:""},
      {description:"Start Date", value:""},
    ]);
  });


});
