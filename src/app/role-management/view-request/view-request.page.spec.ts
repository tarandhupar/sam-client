import { TestBed, fakeAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserAccessMock } from "../../../api-kit/access/access.service.mock";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { ViewRequestPage } from "./view-request.page";
import { RouterTestingModule } from "@angular/router/testing";
import { SamUIKitModule } from "sam-ui-kit/index";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { PipesModule } from "../../app-pipes/app-pipes.module";
import { ActivatedRoute } from "@angular/router";
import { RmCommentsComponent } from "../rm-comments/rm-comments.component";

let ActivatedRouteMock = {
  snapshot: {
    data: {
      request: {"requestorName":"akanksha.chauhan@gsa.gov","supervisorName":"AJ","supervisorEmail":"AJ@gsa.gov","domainId":1,"statusId":1,"requestorMessage":"test","adminMessage":"test","organizationId":"100006688","organizationName":"GSA","roleId":1,"domain":{"id":1,"val":"CONTRACT DATA"},"role":{"id":1,"val":"ADVANCED REPORTS USER"},"status":{"id":1,"val":"PENDING"},"organization":{"id":100006688,"val":"GSA"},"createdBy":"RMS","createdDate":"2017-07-07T08:10:15.677 EDT","updatedDate":"2017-07-07T08:10:15.677 EDT","links":[],"id":1},
    }
  }
};

describe('The view request page', () => {
  let component: ViewRequestPage;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ViewRequestPage,
        RmCommentsComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SamUIKitModule,
        PipesModule,
        AppComponentsModule,
      ],
      providers: [
        AlertFooterService,
        { provide: ActivatedRoute, useValue: ActivatedRouteMock },
        { provide: UserAccessService, useValue: UserAccessMock },
      ]
    });

    fixture = TestBed.createComponent(ViewRequestPage);
    component = fixture.componentInstance;
  });

  it('should compile and initialize', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
  });
});
