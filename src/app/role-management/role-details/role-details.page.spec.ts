import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { RoleDetailsPage } from "./role-details.page";
import { PermissionSelectorComponent } from "../permission-selector/permission-selector";
import { SamUIKitModule } from "sam-ui-kit/index";
import { RouterTestingModule } from "@angular/router/testing";
import { UserAccessMock } from "../../../api-kit/access/access.service.mock";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component } from "@angular/core";
import { Observable } from "rxjs";

let domains = {
  _embedded: {
    domainList: []
  }
};

let mockActivatedRoute = {
  parent: {
    snapshot: {
      data: {
        domains: domains
      }
    }
  },
  params: Observable.of({roleId: '2'}),
  queryParams: Observable.of({domain: '1'})
};

let routerStub = {
  navigateByUrl: () => { },
};

@Component({
  template: ''
})
class DummyComponent { }

fdescribe('The Roles Edit and New pages', () => {
  let component: RoleDetailsPage;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleDetailsPage, PermissionSelectorComponent, DummyComponent],
      imports: [
        FormsModule,
        SamUIKitModule,
        // RouterTestingModule.withRoutes([
        //   { path: 'access/workspace',  component: DummyComponent },
        // ])
      ],
      providers: [
        AlertFooterService,
        { provide: Router, useValue: routerStub },
        { provide: UserAccessService, useValue: UserAccessMock },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });

    fixture = TestBed.createComponent(RoleDetailsPage);
    component = fixture.componentInstance;
  });

  it('should compile and initialize', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
  });

  it('should update fields when the domain changes', fakeAsync(() => {
    component.ngOnInit();
    component.onDomainChange();
    tick();
  }));

  it('should do more initalization in edit mode', fakeAsync(() => {
    let router = fixture.debugElement.injector.get(Router);
    router.url = '/edit';
    component.ngOnInit();
    tick();
  }));

  it('should parse input fields and send a request to the server in new mode', fakeAsync(() => {
    component.ngOnInit();
    component.selectedDomain = 1;
    component.onDomainChange();
    tick();
    component.role = 'new role name';
    component.onSubmitClick();
  }));
});
