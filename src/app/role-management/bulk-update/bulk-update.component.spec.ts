import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { BulkUpdateComponent } from "./bulk-update.component";
import { RouterTestingModule } from "@angular/router/testing";
import { UserService } from "../../users/user.service";
import { UserServiceMock } from "../../users/user.service.mock";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { UserAccessMock } from "../../../api-kit/access/access.service.mock";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { SamUIKitModule } from "sam-ui-kit/index";
import { PipesModule } from "../../app-pipes/app-pipes.module";
import { FHService } from "../../../api-kit/fh/fh.service";
import { FHServiceMock } from "../../../api-kit/fh/fh.service.mock";
import { Router } from "@angular/router";

describe('The Bulk Update Component', () => {
  let component: BulkUpdateComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BulkUpdateComponent
      ],
      imports: [
        FormsModule,
        AppComponentsModule,
        RouterTestingModule,
        SamUIKitModule,
        PipesModule
      ],
      providers: [
        { provide: UserService, useClass: UserServiceMock },
        { provide: UserAccessService, useValue: UserAccessMock },
        { provide: FHService, useClass: FHServiceMock },
        CapitalizePipe,
      ],
    });

    fixture = TestBed.createComponent(BulkUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile and initialize', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
  });

  it('should bulk update some things', fakeAsync(() => {
    component.ngOnInit();
    tick();
    component.onDomainChange(1);
    tick();
    component.onOrganizationChange({value: 1});
    tick();
    tick();
    component.onNextClick(); // go to users page
    tick();
    component.onNextClick(); // go to access page
    tick();
    component.onNextClick(); // go to review page
    tick();
    fixture.debugElement.injector.get(Router).navigate = () => { };
    component.onDoneClick();
    tick();
  }));

  it('should format user names', () => {
    let user: any = {firstName: 'James', lastName: 'Bond'};
    let name = component.formatUserName(user);
    expect(name).toEqual('James Bond - ');
    user = {firstName: 'Timmy!'};
    name = component.formatUserName(user);
    expect(name).toEqual('Timmy! - ');
    user = {lastName: 'Timmy!'};
    name = component.formatUserName(user);
    expect(name).toEqual('Timmy! - ');
  });
});
