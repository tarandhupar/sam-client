import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { OrgHierarchyPage } from "./hierarchy.component";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { FlashMsgService } from "../flash-msg-service/flash-message.service";
import { FHService } from "api-kit/fh/fh.service";
import { FHServiceMock } from "api-kit/fh/fh.service.mock"


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

fdescribe('Organization Hierarchy Page', () => {
  // provide our implementations or mocks to the dependency injector
  let component:OrgHierarchyPage;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgHierarchyPage ],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule, RouterTestingModule, AppComponentsModule ],
      providers: [
        FlashMsgService,
        { provide: ActivatedRoute, useValue: activatedRouteStub},
        { provide: FHService ,useClass:FHServiceMock},
      ]
    });
    fixture = TestBed.createComponent(OrgHierarchyPage);
    component = fixture.componentInstance;
  });

  it('should show first 10 hierarchy organization', () => {
    fixture.detectChanges();
    expect(component.orgList.length).toBe(10);
    component.onSortChanged();
    expect(component.curPage).toBe(0);
  });

  it('should be able to show hierarchy organization as active or inactive', () => {
    fixture.detectChanges();
    //endDate: Thursday, May 20, 2004 12:00:00 AM
    expect(component.isOrgActive({endDate:1085011200000})).toBeFalsy();
    expect(component.isOrgActive({})).toBeTruthy();
  });

});
