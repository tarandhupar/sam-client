import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { OrgMovePage } from "./move-org.component";
import { OrgCreateForm } from "../create-org-form/create-org-form.component";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-elements/src/ui-kit";
import { SamAPIKitModule } from "api-kit";
import { FlashMsgService } from "../flash-msg-service/flash-message.service";
import { FHService } from "api-kit/fh/fh.service";
import * as moment from 'moment/moment';
import { FHServiceMock } from "api-kit/fh/fh.service.mock"

let activatedRouteStub = {
  snapshot: {
    _lastPathIndex: 0,
  },
  parent: {
    params: Observable.of({ orgId: "100000121"})
  },
  queryParams: {
    first: function() {return Observable.of({});},
    subscribe: function() { }
  }
};

describe('Move Organization Page', () => {
  // provide our implementations or mocks to the dependency injector
  let component:OrgMovePage;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgMovePage, OrgCreateForm ],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule, RouterTestingModule, AppComponentsModule ],
      providers: [
        FlashMsgService,
        { provide: ActivatedRoute, useValue: activatedRouteStub},
        { provide: FHService ,useClass:FHServiceMock},
      ]
    });
    fixture = TestBed.createComponent(OrgMovePage);
    component = fixture.componentInstance;
  });

  it('should be able to set and verify end date for move organization', done => {

    let fhs = fixture.debugElement.injector.get(FHService);
    spyOn(fhs, 'getOrganizationById').and.returnValue(Observable.of({_embedded: [{org: {categoryDesc: "SUB COMMAND", categoryId: "CAT-6", code: "RMAC", createdBy: "DODMIGRATOR", createdDate: 1053388800000, description: "RMAC", fpdsOrgId: "RMAC", fullParentPath: "100000000.100000012.100000117", fullParentPathName: "DEPT_OF_DEFENSE.DEPT_OF_THE_ARMY.AMC", isSourceFpds: true, l1Name: "DEPT OF DEFENSE", l1OrgKey: 100000000, l2Name: "DEPT OF THE ARMY", l3Name: "AMC", lastModifiedBy: "FPDSADMIN", lastModifiedDate: 1161993600000, level: 3, name: "RMAC", orgCode: "ORG-2899", orgKey: 100000120, parentOrg: "AMC", parentOrgKey: 100000117, type: "OFFICE", orgAddresses:[] } }]}));
    spyOn(fhs, 'getOrganizationDetail').and.returnValue(Observable.of({_embedded: [{org: {categoryDesc: "SUB COMMAND", categoryId: "CAT-6", code: "RMAC", createdBy: "DODMIGRATOR", createdDate: 1053388800000, description: "RMAC", fpdsOrgId: "RMAC", fullParentPath: "100000000.100000012.100000117", fullParentPathName: "DEPT_OF_DEFENSE.DEPT_OF_THE_ARMY.AMC", isSourceFpds: true, l1Name: "DEPT OF DEFENSE", l1OrgKey: 100000000, l2Name: "DEPT OF THE ARMY", l3Name: "AMC", lastModifiedBy: "FPDSADMIN", lastModifiedDate: 1161993600000, level: 3, name: "RMAC", orgCode: "ORG-2899", orgKey: 100000120, parentOrg: "AMC", parentOrgKey: 100000117, type: "OFFICE", orgAddresses:[] } },
      {_links:[{link:{rel:'sub-tier', method: 'POST',}},{link:{rel:'office_move', method: 'PUT_TRANSFER',}}]}]}));

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.isValidEndDate()).toBeFalsy();
      component.setOrgEndDate('2017-01-01');
      expect(component.isValidEndDate()).toBeFalsy();
      component.setOrgEndDate(moment().add(2,'years').format('Y-M-D'));
      expect(component.isValidEndDate()).toBeFalsy();
      done();
    });

  });


});
