import {TestBed} from "@angular/core/testing";
import {FALFormChangeRequestComponent} from "./fal-form-change-request.component";
import {SamUIKitModule} from "sam-ui-elements/src/ui-kit/index";
import {RouterTestingModule} from "@angular/router/testing";
import {Router} from '@angular/router';
import {Location} from "@angular/common";
import {ProgramService} from "../../../api-kit/program/program.service";
import {FormBuilder, ReactiveFormsModule, FormsModule} from "@angular/forms";
import {SamAPIKitModule} from "../../../api-kit/api-kit.module";
import {AppComponentsModule} from "../../app-components/app-components.module";
import {FALFormService} from "../assistance-listing-operations/fal-form.service";
import {FALFormServiceStub} from "../assistance-listing-operations/fal-form.service.spec";
import {ChangeRequestService} from "../../../api-kit/program/change-request.service";
import {FHService} from "../../../api-kit/fh/fh.service";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import {Observable} from "rxjs";

var programServiceStub ={
  getCfdaCode: (orgId: string) =>{
    return Observable.of({
      "content":{
        "cfdaCode":"93",
        "orgKey":"100004222"
      },
      "_links":{
        "self":{
          "href":"https://gsaiae-dev02.reisys.com/fac/v1/programs/getCfdaCode?organizationId=100004222"
        }
      }
    });
  },
  getPermissions: (cookie: string, permissions: any, orgId: string = null) => {
    return Observable.of({
      "INITIATE_CANCEL_ARCHIVE_CR":true,
      "INITIATE_CANCEL_NUMBER_CR":true,
      "INITIATE_CANCEL_TITLE_CR":true,
      "APPROVE_REJECT_TITLE_CR":true,
      "APPROVE_REJECT_UNARCHIVE_CR":true,
      "INITIATE_CANCEL_AGENCY_CR":true,
      "APPROVE_REJECT_AGENCY_CR":true,
      "INITIATE_CANCEL_UNARCHIVE_CR":true,
      "APPROVE_REJECT_NUMBER_CR":true,
      "APPROVE_REJECT_ARCHIVE_CR":true
    });
  },
};

xdescribe('Change Request Component', () =>{
  let component: FALFormChangeRequestComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FALFormChangeRequestComponent],
      imports: [SamUIKitModule, AppComponentsModule, ReactiveFormsModule, FormsModule, SamAPIKitModule, RouterTestingModule],
      providers:[ProgramService, FALFormService, ChangeRequestService]
    });
    TestBed.overrideComponent(FALFormChangeRequestComponent, {
      set: {
        providers: [
          { provide: ProgramService, useValue: programServiceStub },
          { provide: FALFormService, useClass: FALFormServiceStub }
        ]
      }
    });
    fixture = TestBed.createComponent(FALFormChangeRequestComponent);
    component = fixture.componentInstance;
  });

  it('should compile', function(){
    fixture.detectChanges();
    expect(true).toBe(true);
  });
});