import { TestBed } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { RoleDetailsPage } from "./role-details.page";
import { SamFormControlsModule } from "sam-ui-kit/form-controls";
import { PermissionSelectorComponent } from "../permission-selector/permission-selector";
import { SamUIKitModule } from "sam-ui-kit/index";
import { RouterTestingModule } from "@angular/router/testing";
import { UserAccessMock } from "../../../api-kit/access/access.service.mock";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";

describe('The Roles Edit and New pages', () => {
  let component: RoleDetailsPage;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleDetailsPage, PermissionSelectorComponent],
      imports: [FormsModule, SamUIKitModule, RouterTestingModule],
      providers: [
        AlertFooterService,
        { provide: UserAccessService, useValue: UserAccessMock },
      ]
    });

    fixture = TestBed.createComponent(RoleDetailsPage);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

});
