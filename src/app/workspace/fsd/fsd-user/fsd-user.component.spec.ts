import { ActivatedRoute } from '@angular/router';
import { DebugElement } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { SamUIKitModule } from 'sam-ui-kit';

import { FHService, FHWrapperService, WrapperService } from 'api-kit';

import { FSDUserComponent } from './fsd-user.component';

const response = Observable.of({
  _embedded: [{
    org: {
      type:           'DEPARTMENT',
      hierarchy:      [100006688],
      level:          'D',
      fullParentPath: '',
      elementId:      1000000,
      l1Name:         'Dummy'
    }
  }]
});

const stubs = {
  ActivatedRoute: {
    params: Observable.of({
      id: 'john.doe@gsa.com'
    })
  },

  FHService: {
    getDepartments() {
      return response;
    },

    getOrganizationById(id: string, includeChildrenLevels: boolean) {
      return response;
    }
  },

  WrapperService: {
    call(oApiParam) {
      return {};
    }
  }
};

describe('[IAM] FSDUserComponent', () => {
  let component: FSDUserComponent;
  let fixture: ComponentFixture<FSDUserComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        SamUIKitModule,
      ],

      declarations: [
        FSDUserComponent,
      ],

      providers: [
        { provide: ActivatedRoute, useValue: stubs.ActivatedRoute },
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: WrapperService, useValue: stubs.WrapperService },
        { provide: FHService, useValue: stubs.FHService },
        FHWrapperService,
      ]
    });

    fixture = TestBed.createComponent(FSDUserComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  it('verify account deactivation', async(() => {
    let button = fixture.debugElement.query(By.css('sam-button button')).nativeElement;

    spyOn(component, 'confirmDeactivation');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.confirmDeactivation).toHaveBeenCalled();
    });
  }));

  it('verify password reset', async(() => {
    let button = fixture.debugElement.query(By.css('#password-reset button')).nativeElement;

    spyOn(component, 'sendPasswordReset');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.sendPasswordReset).toHaveBeenCalled();
    });
  }));
});
