import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit/index';
import { UserAccessMock } from '../../../api-kit/access/access.service.mock';
import { UserAccessService } from '../../../api-kit/access/access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ObjectDetailsPage } from './object-details.page';
import { AppComponentsModule } from '../../app-components/app-components.module';
import { AlertFooterService } from '../../app-components/alert-footer/alert-footer.service';
import { SamTitleService } from '../../../api-kit/title-service/title.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

let activatedRouteMock = {
    queryParams: Observable.of({
        domain: 1
    }),
    params: Observable.of({
        objectId: 1
    })
  };

describe('Object Detail pages', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ObjectDetailsPage,
      ],
      providers: [
        // UserService,
        AlertFooterService,
        SamTitleService,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: UserAccessService, useValue: UserAccessMock },
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

    fixture = TestBed.createComponent(ObjectDetailsPage);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(true).toBe(true);
  });

  it('should be able to enable emit mode', () => {
    component.mode = 'edit';
    fixture.detectChanges();
  });

});
