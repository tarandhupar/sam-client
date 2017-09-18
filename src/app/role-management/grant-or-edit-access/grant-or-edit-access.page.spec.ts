import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "../../.";
import { ParentOrgsComponent } from "./parent-orgs/parent-orgs.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { GrantOrEditAccess } from "./grant-or-edit-access";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { AppTemplatesModule } from "../../app-templates/index";
import { UserService } from "../user.service";
import { UserServiceMock } from "../user.service.mock";

describe('Grant And Edit Access pages', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GrantOrEditAccess,
      ],
      providers: [
        { provide: UserService, useClass: UserServiceMock },
      ],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        SamUIKitModule,
        AppComponentsModule,
        AppTemplatesModule,
        SamAPIKitModule,
      ]
    });

    fixture = TestBed.createComponent(GrantOrEditAccess);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(true).toBe(true);
	});

  it('should initialize', fakeAsync(() => {
    component.ngOnInit();
    tick();
  }));
});
