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
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { AppComponentsModule } from "../../app-components/app-components.module";

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

describe('Organization Detail Profile Page', () => {
  // provide our implementations or mocks to the dependency injector
  let component:OrgDetailProfilePage;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgDetailProfilePage ],
      imports:[ SamUIKitModule, SamAPIKitModule, RouterTestingModule, FormsModule, AppComponentsModule ],
      providers: [
        FlashMsgService,
        AlertFooterService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub},
        { provide: FHService ,useClass:FHServiceMock}
      ]
    });
    fixture = TestBed.createComponent(OrgDetailProfilePage);
    component = fixture.componentInstance;
  });

  it('should compile without error', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should have correct parameters', done => {

    let fhs = fixture.debugElement.injector.get(FHService);
    spyOn(fhs, 'getOrganizationById').and.returnValue(Observable.of({_embedded: [{org: {categoryDesc: "OFFICE",categoryId: "CAT-6",code: "RMAC",createdBy: "DODMIGRATOR",createdDate: 1053388800000,description: "RMAC",fpdsOrgId: "RMAC",fullParentPath: "100000000.100000012.100000117.100000120",fullParentPathName: "DEPT_OF_DEFENSE.DEPT_OF_THE_ARMY.AMC.RMAC",isSourceFpds: true,l1Name: "DEPT OF DEFENSE",l1OrgKey: 100000000,l2Name: "DEPT OF THE ARMY",l3Name: "AMC",l4Name: "RMAC",lastModifiedBy: "FPDSADMIN",lastModifiedDate: 1161993600000,level: 4,name: "RMAC",orgCode: "ORG-2899",orgKey: 100000120,parentOrg: "AMC",parentOrgKey: 100000117,type: "OFFICE",orgAddresses:[]}}]}));
    spyOn(fhs, 'getOrganizationDetail').and.returnValue(Observable.of({_embedded:[{org: {categoryDesc: "OFFICE",categoryId: "CAT-6",code: "RMAC",createdBy: "DODMIGRATOR",createdDate: 1053388800000,description: "RMAC",fpdsOrgId: "RMAC",fullParentPath: "100000000.100000012.100000117.100000120",fullParentPathName: "DEPT_OF_DEFENSE.DEPT_OF_THE_ARMY.AMC.RMAC",isSourceFpds: true,l1Name: "DEPT OF DEFENSE",l1OrgKey: 100000000,l2Name: "DEPT OF THE ARMY",l3Name: "AMC",l4Name: "RMAC",lastModifiedBy: "FPDSADMIN",lastModifiedDate: 1161993600000,level: 4,name: "RMAC",orgCode: "ORG-2899",orgKey: 100000120,parentOrg: "AMC",parentOrgKey: 100000117,type: "OFFICE",orgAddresses:[]}},{_links:[{link:{rel:'sub-tier',method: 'POST',}}]}]}));

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.currentHierarchyType).toBe("OFFICE");
      expect(component.orgDetails).toEqual([
        {description:"Office Name", value:"Rmac"},
        {description:"Description", value:""},
        {description:"Shortname", value:""},
        {description:"Start Date", value:""},
        {description:"End Date", value:""},
        {description:'Indicate Funding', value: ''}
      ]);
      done();
    });
  });

  it('should open to edit organization detail if the source is from fpds', done => {
    let fhs = fixture.debugElement.injector.get(FHService);
    spyOn(fhs, 'getOrganizationById').and.returnValue(Observable.of({_embedded: [{org: {categoryDesc: "OFFICE",categoryId: "CAT-6",code: "RMAC",createdBy: "DODMIGRATOR",createdDate: 1053388800000,description: "RMAC",fpdsOrgId: "RMAC",fullParentPath: "100000000.100000012.100000117.100000120",fullParentPathName: "DEPT_OF_DEFENSE.DEPT_OF_THE_ARMY.AMC.RMAC",isSourceFpds: true,l1Name: "DEPT OF DEFENSE",l1OrgKey: 100000000,l2Name: "DEPT OF THE ARMY",l3Name: "AMC",l4Name: "RMAC",lastModifiedBy: "FPDSADMIN",lastModifiedDate: 1161993600000,level: 4,name: "RMAC",orgCode: "ORG-2899",orgKey: 100000120,parentOrg: "AMC",parentOrgKey: 100000117,type: "OFFICE",orgAddresses:[]}}]}));
    spyOn(fhs, 'getOrganizationDetail').and.returnValue(Observable.of({_embedded:[{org: {categoryDesc: "OFFICE",categoryId: "CAT-6",code: "RMAC",createdBy: "DODMIGRATOR",createdDate: 1053388800000,description: "RMAC",fpdsOrgId: "RMAC",fullParentPath: "100000000.100000012.100000117.100000120",fullParentPathName: "DEPT_OF_DEFENSE.DEPT_OF_THE_ARMY.AMC.RMAC",isSourceFpds: true,l1Name: "DEPT OF DEFENSE",l1OrgKey: 100000000,l2Name: "DEPT OF THE ARMY",l3Name: "AMC",l4Name: "RMAC",lastModifiedBy: "FPDSADMIN",lastModifiedDate: 1161993600000,level: 4,name: "RMAC",orgCode: "ORG-2899",orgKey: 100000120,parentOrg: "AMC",parentOrgKey: 100000117,type: "OFFICE",orgAddresses:[]}},{_links:[{link:{rel:'sub-tier',method: 'POST',}}]}]}));

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.currentHierarchyType).toBe("OFFICE");
      expect(component.isEdit).toBeFalsy();
      expect(component.isFPDSSource).toBeTruthy();
      component.onEditPageClick();
      component.editedDescription = "test summary";
      component.editedShortname = "test short name";
      component.onSaveEditPageClick();
      done();
    });
  });

});
