import { GrantAccessPage } from "./grant-access.page";
import { UserAccessPage } from "../access/access.page";
import { GroupByDomainPipe } from "../access/group-by-domain.pipe";
import { ObjectsAndPermissionsComponent } from "../objects-and-permissions/objects-and-permissions.component";
import { TestBed } from "@angular/core/testing";
import { SamUIKitModule } from "sam-ui-kit/index";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { PipesModule } from "../../app-pipes/app-pipes.module";
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";
import { PageScrollService } from "ng2-page-scroll";
import { UserAccessMock } from "api-kit/access/access.service.mock";
import { UserAccessService } from "api-kit/access/access.service";
import { ActivatedRoute } from "@angular/router";
import { routes } from "../users.route";
import { RequestDetailsComponent } from "../../role-management/request-details/request-details";
import { RoleTable } from "../role-table/role-table.component";
import { WorkspaceTemplateComponent } from "../../app-templates/workspace/workspace-template.component";
import { PendingRequestsComponent } from "../pending-requests/pending-requests.component";

let activatedRouteStub = {
  snapshot: {
    _lastPathIndex: 0,
  },
  parent: {
    snapshot: {
      params: { id: "tim@tim.com"}
    }
  },
  queryParams: {
    subscribe: function() { }
  }
};

describe('The GrantAccessPage component', () => {
  let component:GrantAccessPage;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GrantAccessPage,
        GroupByDomainPipe,
        ObjectsAndPermissionsComponent,
        RequestDetailsComponent,
      ],
      imports: [
        SamUIKitModule,
        RouterTestingModule.withRoutes([]),
        FormsModule,
        AppComponentsModule,
        PipesModule
      ],
      providers: [
        AlertFooterService,
        PageScrollService,
        { provide: UserAccessService, useValue: UserAccessMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ]
    });

    fixture = TestBed.createComponent(GrantAccessPage);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(true).toBe(true);
  });

  // it('should save', async(() => {
  //   let svc = fixture.debugElement.injector.get(UserAccessService);
  //   spyOn(svc, 'postAccess');
  //
  //   component.ngOnInit();
  //   fixture.detectChanges();
  //   component.onOrganizationsChange([{name: "GSA", value: 1}]);
  //   component.onDomainChange(1);
  //   fixture.whenStable().then(() => {
  //     component.onRoleChange(1);
  //     fixture.detectChanges();
  //     let permissionCheckbox = fixture.debugElement.query(By.css('.permission-input'));
  //     permissionCheckbox.nativeElement.click();
  //     fixture.detectChanges();
  //     expect(true).toBe(true);
  //     // FIXME: onGrantClick attempts to change the route and crashes tests
  //     //component.onGrantClick();
  //     //expect(svc.postAccess).toHaveBeenCalled();
  //   });
  //
  // }));
});
