import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

import { FHService, FHWrapperService, WrapperService } from 'api-kit';

import { SamUIKitModule } from 'sam-ui-kit';
import { AppComponentsModule, AgencyPickerComponent } from 'app-components/app-components.module';
import { DetailsComponent } from './details.component';

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

const fhStub = {
  getDepartments() {
    return response;
  },

  getOrganizationById(id: string, includeChildrenLevels: boolean) {
    return response;
  }
};

const apiStub = {
  call(oApiParam) {
    return {};
  }
};

describe('[IAM] User Profile - Details', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        SamUIKitModule,
        AppComponentsModule
      ],

      declarations: [
        DetailsComponent,
      ],

      providers: [
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: WrapperService, useValue: apiStub },
        { provide: FHService, useValue: fhStub },
        FHWrapperService
      ]
    });

    TestBed.overrideComponent(AgencyPickerComponent, {
      set: {
        providers: [
          { provide: FHService, useValue: fhStub },
          { provide: WrapperService, useValue: apiStub }
        ]
      }
    });

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
  });

  it('verify data-binding for email notification setting', () => {
    let checkbox;

    component.ngOnInit();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('#identity sam-editor .usa-additional_text')).nativeElement.click();
    fixture.detectChanges();
    checkbox = fixture.debugElement.query(By.css('#email-notification')).nativeElement;

    checkbox.click();
    fixture.detectChanges();
    expect(component.user.emailNotification).toBe(true);

    checkbox.click();
    fixture.detectChanges();
    expect(component.user.emailNotification).toBe(false);
  });

  it('verify population of error messages -> "Identity" section', () => {
    let error,
        message;

    component.alerts.identity.type = 'error';
    component.alerts.identity.message = 'Test Error Message';
    component.alerts.identity.show = true;

    fixture.detectChanges();

    error = fixture.debugElement.query(By.css('#identity sam-alert'));

    if(error && error.nativeElement) {
      message = error.nativeElement.querySelector('.usa-alert-heading');
    }

    expect(error).toBeDefined();
    expect(message.innerHTML).toBe(component.alerts.identity.message);
  });

  it('verify population of error messages -> "Organization" section', () => {
    let error,
        message;

    component.alerts.business.type = 'error';
    component.alerts.business.message = 'Test Error Message';
    component.alerts.business.show = true;

    fixture.detectChanges();

    error = fixture.debugElement.query(By.css('#business sam-alert'));

    if(error && error.nativeElement) {
      message = error.nativeElement.querySelector('.usa-alert-heading');
    }

    expect(error).toBeDefined();
    expect(message.innerHTML).toBe(component.alerts.business.message);
  });
});
