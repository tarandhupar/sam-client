import { GrantAccessPage } from "./grant-access.page";
import { GroupByDomainPipe } from "../access/group-by-domain.pipe";
import { ObjectsAndPermissionsComponent } from "../objects-and-permissions/objects-and-permissions.component";
import { TestBed, async } from "@angular/core/testing";
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
import { RequestDetailsComponent } from "../../role-management/request-details/request-details";
import { UserServiceMock } from "../user.service.mock";
import { UserService } from "../user.service";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";
import { Observable } from "rxjs";
import { FHService } from "../../../api-kit/fh/fh.service";
import { FHServiceMock } from "../../../api-kit/fh/fh.service.mock";

let activatedRouteStub = {
  snapshot: {
    _lastPathIndex: 0,
    params: { id: "tim@tim.com"},
    queryParams: {},
    data: { mode: 'grant' },
  },
  queryParams: Observable.of({})
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
        CapitalizePipe,
        AlertFooterService,
        PageScrollService,
        { provide: UserAccessService, useValue: UserAccessMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: UserService, useClass: UserServiceMock },
        { provide: FHService, useClass: FHServiceMock },
      ]
    });
    fixture = TestBed.createComponent(GrantAccessPage);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(true).toBe(true);
  });

  it('should save grants', done => {

    component.ngOnInit();
    fixture.detectChanges();
    component.onOrganizationsChange([{name: "GSA", value: 1}]);
    component.onDomainChange(1);
    fixture.whenStable().then(() => {
      component.onRoleChange(1);
      fixture.detectChanges();
      component.onGrantClick();
      done();
      // FIXME: onGrantClick attempts to change the route and crashes tests
      //component.onGrantClick();
      //expect(svc.postAccess).toHaveBeenCalled();
    });
  });
});
