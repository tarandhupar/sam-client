import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SamUIKitModule } from "sam-ui-elements/src/ui-kit/index";
// import { SamAPIKitModule } from "../../.";
// import { ParentOrgsComponent } from "./parent-orgs/parent-orgs.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { GrantOrEditAccess } from "./grant-or-edit-access";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { UserService } from "../user.service";
import { UserServiceMock } from "../user.service.mock";
import { SamTitleService } from "../../../api-kit/title-service/title.service";
import { UserService } from "../user.service";

describe('Grant And Edit Access pages', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GrantOrEditAccess,
      ],
      providers: [
        UserService,
        AlertFooterService,
        SamTitleService,
        { provide: UserService, useClass: UserServiceMock },
      ],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        SamUIKitModule,
        AppComponentsModule,
        // AppTemplatesModule,
        // SamAPIKitModule,
      ]
    });

    fixture = TestBed.createComponent(GrantOrEditAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(true).toBe(true);
  });

  it('should initialize', () => {
    component.ngOnInit();
  });
});
