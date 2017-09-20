import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { OrgCreatePage } from "./create-org.component";
import { OrgCreateForm } from "../create-org-form/create-org-form.component";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { FlashMsgService } from "../flash-msg-service/flash-message.service";
import { FHService } from "api-kit/fh/fh.service";
import { FHServiceMock } from "api-kit/fh/fh.service.mock";
import { LocationService } from "api-kit/location/location.service";

class LocationServiceStub {
  validateZipWIthLocation(zip:string, state?:any, city?:any):any{
    return Observable.of({description:'VALID'});
  }
};

xdescribe('Create Organization Page', () => {
  // provide our implementations or mocks to the dependency injector
  let component:OrgCreatePage;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgCreatePage, OrgCreateForm ],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule, RouterTestingModule, AppComponentsModule ],
      providers: [
        FlashMsgService,
        { provide: Router,  useValue:{events:Observable.of({url:"/create-organization"}), navigateByUrl:(url)=>{return url;}} },
        { provide: ActivatedRoute, useValue: {'queryParams': Observable.from([{ 'orgType': 'Office',  'parentID': '100000000',}])}},
        { provide: FHService ,useClass:FHServiceMock},
        { provide: LocationService ,useClass:LocationServiceStub},
      ]
    });
    fixture = TestBed.createComponent(OrgCreatePage);
    component = fixture.componentInstance;
  });

  it('should compile without error', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should be able to return correct path id and name', () =>{
    fixture.detectChanges();
    let fullParentPath = "100000000.100000012.100000117.100000120";
    let fullParentPathName = "DEPT_OF_DEFENSE.DEPT_OF_THE_ARMY.AMC.RMAC";
    component.setupHierarchyPathMap(fullParentPath, fullParentPathName);
    expect(component.hierarchyPath).toEqual(['DEPT OF DEFENSE','DEPT OF THE ARMY','AMC','RMAC']);
    expect(component.hierarchyPathMap['DEPT OF DEFENSE']).toBe('100000000');
    expect(component.hierarchyPathMap['DEPT OF THE ARMY']).toBe('100000012');
    expect(component.hierarchyPathMap['AMC']).toBe('100000117');
  });

});
