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

describe('Organization Detail Profile Page', () => {
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

  it('should have correct parameters and next layer text', () => {
    fixture.detectChanges();
    fixture.detectChanges();
    expect(component.getNextLayer()).toBe("Office");
    expect(component.currentHierarchyType).toBe("Office");
    expect(component.orgDetails).toEqual([
      {description:"Office Name", value:"Us Army Robert Morris Acquisitio"},
      {description:"Description", value:""},
      {description:"Shortname", value:""},
      {description:"Start Date", value:moment(970358400000).format('MM/DD/YYYY')},
      {description:"Indicate Funding", value:"Funding/Award"},
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
