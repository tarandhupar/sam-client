import {
  inject,
  TestBed,
  ComponentFixture
} from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { SamUIKitModule } from "sam-ui-elements/src/ui-kit";
import { SamAPIKitModule } from "api-kit";
import { WorkspaceModule } from "../../workspace.module";
import { CbaWidgetComponent } from './cba-widget.component';
import { UserService } from "../../../role-management/user.service";

let component: CbaWidgetComponent;
let fixture: ComponentFixture<CbaWidgetComponent>;

describe('Workspace Page: Cba Widget', () => {
  let MockUserService = {
    getUser: () => {
      return {
        isGov: true,
        lastName: "Administrator",
        _id: "FBO_AA@gsa.gov",
        email: "FBO_AA@gsa.gov",
        _links: {
          self: {
            href: "/comp/iam/auth/v4/session/"
          }
        }
      }
    }
  };

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        SamUIKitModule,
        SamAPIKitModule,
        WorkspaceModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: UserService, useValue: MockUserService },
        CbaWidgetComponent
      ]
    });

    fixture = TestBed.createComponent(CbaWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize data without error', () => {
    component.ngOnInit();
    expect(component).toBeDefined();
    expect(component.isLinkActive).toEqual(false);
  });

  it('toggleClass should toggle isLinkActive value', () => {
    component.toggleClass(true);
    expect(component.isLinkActive).toEqual(true);
  });
});
