import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { HelpContentManagementEditComponent } from './content-management-edit.component';
import { HelpContentManagementSideNavComponent } from '../view/sidenav/content-management-sidenav.component';
import { SamUIKitModule } from '../../../../sam-ui-elements/src/ui-kit';
import { AppComponentsModule } from '../../../app-components';
import { FeedbackFormService } from '../../../app-components/feedback-form/feedback-form.service';
import { CapitalizePipe } from '../../../app-pipes/capitalize.pipe';
import { ContentManagementService, MsgFeedService, SamAPIKitModule } from '../../../../api-kit';
import { ContentManagementServiceMock } from '../../../../api-kit/content-management/content-management.mock';
import { AlertFooterService } from '../../../app-components/alert-footer';
import { HttpModule } from '@angular/http';
import { MsgFeedServiceMock } from '../../../../api-kit/msg-feed/msg-feed.mock';

let queryParams = {
  mode: 'create',
};
let params = {
  section: 'FAQ-repository',
};

let activatedRouteStub = {
  snapshot: {
    _lastPathIndex: 0,
    params,
    queryParams
  },
  params: Observable.of(params),
  queryParams: Observable.of(queryParams),
};

describe('Help content management edit page', () => {
  // provide our implementations or mocks to the dependency injector
  let component: HelpContentManagementEditComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HelpContentManagementEditComponent,
        HelpContentManagementSideNavComponent,
      ],
      imports: [
        SamUIKitModule,
        SamAPIKitModule,
        FormsModule,
        RouterTestingModule,
        AppComponentsModule,
        RouterTestingModule,
        HttpModule,
      ],
      providers: [
        FeedbackFormService,
        CapitalizePipe,
        AlertFooterService,
        { provide: MsgFeedService, useClass: MsgFeedServiceMock },
        { provide: ContentManagementService, useClass: ContentManagementServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ]
    });
    fixture = TestBed.createComponent(HelpContentManagementEditComponent);
    component = fixture.componentInstance;
  });

  it('should compile without error', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

});
