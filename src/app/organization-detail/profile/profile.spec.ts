import {
  inject,
  TestBed
} from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import * as moment from 'moment/moment';
import { FormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { OrgDetailProfilePage } from "./profile.component";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { FHService } from "../../../api-kit/fh/fh.service";
import { FlashMsgService } from "../flash-msg-service/flash-message.service";
import { FHServiceMock } from "../../../api-kit/fh/fh.service.mock";

class RouterStub {
  navigate(url: string) { return url; }
}

let activatedRouteStub = {
  snapshot: {
    _lastPathIndex: 0,
  },
  parent: {
    params: Observable.of({ orgId: "100000121"})
  },
  queryParams: {
    subscribe: function() { }
  }
};

class FHServiceStub {
  getAccess(orgId){return Observable.of({});}
  createOrganization(orgObj, parentPath, parentPathName){return Observable.of({});}
  updateOrganization(orgObj,isMove){return Observable.of({});}
  getOrganizationById(orgId:string, childHierarchy:boolean=false, parentHierarchy:boolean=true):any{
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

fdescribe('Organization Detail Profile Page', () => {
  // provide our implementations or mocks to the dependency injector
  let component:OrgDetailProfilePage;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgDetailProfilePage ],
      imports:[ SamUIKitModule, SamAPIKitModule, RouterTestingModule, FormsModule],
      providers: [
        FlashMsgService,
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

  it('should have correct parameters', () => {
    fixture.detectChanges();
    expect(component.currentHierarchyType).toBe("SUB COMMAND");
    expect(component.orgDetails).toEqual([
      {description:"Sub Command Name", value:"Rmac"},
      {description:"Description", value:""},
      {description:"Shortname", value:""},
      {description:"Start Date", value:""},
      {description:"End Date", value:""},
    ]);
  });

  // it('should switch to correct organization details if click on the link', () => {
  //   fixture.detectChanges();
  //   component.onChangeOrgDetail("RMAC");
  //   expect(component.getNextLayer()).toBe("Office");
  //   expect(component.currentHierarchyType).toBe("Sub Command");
  //   expect(component.orgDetails).toEqual([
  //     {description:"Sub Command Name", value:"Rmac"},
  //     {description:"Description", value:""},
  //     {description:"Shortname", value:""},
  //     {description:"Start Date", value:""},
  //   ]);
  // });

});
