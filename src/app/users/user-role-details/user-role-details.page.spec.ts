import { TestBed } from '@angular/core/testing';
import { SamUIKitModule } from "sam-ui-kit/index";
import { AlertFooterService } from "../../../alerts/alert-footer/alert-footer.service";
import { UserRoleDetailsPage } from "./user-role-details.page";
import { SamTitleSubtitleComponent } from "../../app-components/title-subtitle/title-subtitle.component";
import { SamBreadcrumbsComponent } from "sam-ui-kit/components/bre";
import { RouterTestingModule } from "@angular/router/testing";
import { ActivatedRoute } from "@angular/router";

let mockActivatedRoute = {
  snapshot: {
    _lastPathIndex: 0,
    data: {
      isAdminView: true,
      details: { }
    },
    params: { id: 1 }
  }
};

describe('The Roles Edit and New pages', () => {
  let component: UserRoleDetailsPage;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserRoleDetailsPage,
        SamTitleSubtitleComponent,
      ],
      imports: [
        SamUIKitModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });

    fixture = TestBed.createComponent(UserRoleDetailsPage);
    component = fixture.componentInstance;
  });

  it('should compile and initialize', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
  });
});
