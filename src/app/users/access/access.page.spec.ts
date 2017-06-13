import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { SamUIKitModule } from "sam-ui-kit/index";
import { Router, ActivatedRoute } from "@angular/router";
import { UserAccessPage } from "./access.page";
import { UserAccessService } from "../../../../api-kit/access/access.service";
import { UserAccessMock } from "../../../../api-kit/access/access.service.mock";
import { AlertFooterService } from "../../../alerts/alert-footer/alert-footer.service";
import { DateFormatPipe } from "../../../app-pipes/date-format.pipe";
import { RouterTestingModule } from "@angular/router/testing";
import { FHService } from "../../../../api-kit/fh/fh.service";
import { WrapperService } from "../../../../api-kit/wrapper/wrapper.service";
import { HttpModule } from "@angular/http";
import { Observable } from "rxjs";

let mockActivatedRoute = {
  parent: {
    snapshot: {
      params: {
        id: 1
      }
    }
  },
  snapshot: {
    _lastPathIndex: 0,
  },
  queryParams: Observable.of({admin: 'true'})
};

let fhServiceStub = {
  getOrganizationById: (id: string, includeChildrenLevels: boolean)=>{
    return Observable.of({
      _embedded:[{
        org: { elementId:"1000000", l1Name:"Test Organization", type:"DEPARTMENT" },
        _links: {
          self: {
            href: 'test'
          }
        }
      }
      ]
    });
  }
};


describe('The Roles Edit and New pages', () => {
  let component: UserAccessPage;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserAccessPage, DateFormatPipe],
      imports: [
        FormsModule,
        SamUIKitModule,
        RouterTestingModule,
        HttpModule,
      ],
      providers: [
        AlertFooterService,
        { provide: FHService, useValue: fhServiceStub },
        WrapperService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: UserAccessService, useValue: UserAccessMock },
      ]
    });

    fixture = TestBed.createComponent(UserAccessPage);
    component = fixture.componentInstance;
  });

  it('should compile and initialize', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
  });

  it('should update fields when the domain changes', fakeAsync(() => {
    component.ngOnInit();
    tick();
  }));

  it('should filter roles', fakeAsync(() => {
    fixture.detectChanges();
    component.ngOnInit();
    component.orgsChanged([1, 2]);
    component.rolesChanged([1, 2, 3]);
    component.domainsChanged([1, 2, 3]);
    component.objectsChanged([1, 2, 3]);
    component.permissionsChanged([1, 2, 3]);
  }));

  it('should collapse and expand all the things', fakeAsync(() => {
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();
    component.collapseAll();
    fixture.detectChanges();
    component.expandAll();
    fixture.detectChanges();
  }));

  it('should cancel a request', fakeAsync(() => {
    fixture.detectChanges();
    component.ngOnInit();
    component.onCancelRequestClick(1, 1);
  }));
});
