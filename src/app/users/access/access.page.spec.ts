import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { SamUIKitModule } from "sam-ui-kit/index";
import { ActivatedRoute } from "@angular/router";
import { UserAccessPage } from "./access.page";
import { UserAccessService } from "api-kit/access/access.service";
import { UserAccessMock } from "api-kit/access/access.service.mock";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpModule } from "@angular/http";
import { Observable } from "rxjs";
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";
import { DateFormatPipe } from "../../app-pipes/date-format.pipe";
import { RoleTable } from "../role-table/role-table.component";
import { PendingRequestsComponent } from "../pending-requests/pending-requests.component";
import { WorkspaceTemplateComponent } from "../../app-templates/workspace/workspace-template.component";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { PipesModule } from "../../app-pipes/app-pipes.module";
import { UserPic } from "../user-pic/user-pic.component";
import { UserService } from "../user.service";
import { UserServiceMock } from "../user.service.mock";

let mockActivatedRoute = {
  parent: {
    snapshot: {
      params: {
        id: 1
      }
    }
  },
  snapshot: {
    data: {
      isAdminView: true,
    },
    params: { id: "timmmmmmy" },
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


describe('The User Access Page', () => {
  let component: UserAccessPage;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserAccessPage,
        RoleTable,
        PendingRequestsComponent,
        WorkspaceTemplateComponent,
        UserPic,
      ],
      imports: [
        FormsModule,
        SamUIKitModule,
        PipesModule,
        RouterTestingModule,
        AppComponentsModule,
        HttpModule,
      ],
      providers: [
        AlertFooterService,
        { provide: UserService, useClass: UserServiceMock },
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

});
