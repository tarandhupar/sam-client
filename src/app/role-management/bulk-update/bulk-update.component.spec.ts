import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { BulkUpdateComponent, SamToggle } from "./bulk-update.component";
import { RouterTestingModule } from "@angular/router/testing";
import { UserService } from "../user.service";
import { UserServiceMock } from "../user.service.mock";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { UserAccessMock } from "../../../api-kit/access/access.service.mock";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { SamUIKitModule } from "sam-ui-elements/src/ui-kit/index";
import { PipesModule } from "../../app-pipes/app-pipes.module";
import { FHService } from "../../../api-kit/fh/fh.service";
import { FHServiceMock } from "../../../api-kit/fh/fh.service.mock";
import { Router } from "@angular/router";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";

describe('The Bulk Update Component', () => {
  let component: BulkUpdateComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BulkUpdateComponent,
        SamToggle,
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
        AlertFooterService,
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
    component.mode = 'update';
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
    expect(name).toEqual('James Bond');
    user = {firstName: 'Timmy!'};
    name = component.formatUserName(user);
    expect(name).toEqual('Timmy!');
    user = {lastName: 'Timmy!'};
    name = component.formatUserName(user);
    expect(name).toEqual('Timmy!');
  });

  it('should return correct class name for confirm page icons', () => {
    expect('fa-check default-color').toBe(component.getPermissionStatusIconClass({}));
    expect('fa-plus updated-color').toBe(component.getPermissionStatusIconClass({status:'add'}));
    expect('fa-minus existing-color').toBe(component.getPermissionStatusIconClass({status:'remove'}));
    expect('fa-minus existing-color').toBe(component.getPermissionStatusIconClass({status:'remove'}));
  });

  it('should add correct status to permission for onPermissionChange', () => {
    let permissionUnChecked = {checked:false};
    component.onPermissionChange({},{},permissionUnChecked);
    expect(permissionUnChecked).toEqual({checked:false, status:'remove'});
    component.onPermissionChange({},{},permissionUnChecked);
    expect(permissionUnChecked).toEqual({checked:false});
  });

  it('should be able to do a user search for bulk update', () => {
    component.doUserSearch();
    expect(component.users).toEqual([]);
  });
});
