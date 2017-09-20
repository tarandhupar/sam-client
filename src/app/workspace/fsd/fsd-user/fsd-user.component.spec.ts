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

xdescribe('[IAM] FSD User Profile', () => {
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

  it('verify population of error message for account deactivation', () => {
    let error,
        message;

    component.alerts.deactivate.show = true;
    component.alerts.deactivate.message = 'Test Error Message';

    fixture.detectChanges();

    error = fixture.debugElement.query(By.css('#deactivate-account sam-alert'));

    if(error && error.nativeElement) {
      message = error.nativeElement.querySelector('.usa-alert-heading');
    }

    expect(error).toBeDefined();
    expect(message.innerHTML).toBe(component.alerts.deactivate.message);
  });

  it('verify population of error message for password reset', () => {
    let error,
        message;

    component.alerts.password.show = true;
    component.alerts.password.message = 'Test Error Message';

    fixture.detectChanges();

    error = fixture.debugElement.query(By.css('#password-reset sam-alert'));

    if(error && error.nativeElement) {
      message = error.nativeElement.querySelector('.usa-alert-heading');
    }

    expect(error).toBeDefined();
    expect(message.innerHTML).toBe(component.alerts.password.message);
  });
});
