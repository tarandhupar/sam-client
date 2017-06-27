import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

import { SamUIKitModule } from 'sam-ui-kit';
import { FHService, WrapperService } from 'api-kit';

import { AgencyPickerComponent } from '../../app-components/agency-picker/agency-picker.component';
import { SamKBAComponent, SamPasswordComponent } from '../shared';
import { RegisterMainComponent } from './register-main.component';

const response = Observable.of({
  _embedded: [{
    org: {
      type:           'DEPARTMENT',
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

xdescribe('[IAM] Registration', () => {
  let component: RegisterMainComponent;
  let fixture: ComponentFixture<RegisterMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        SamUIKitModule
      ],

      declarations: [
        AgencyPickerComponent,
        RegisterMainComponent,
        SamKBAComponent,
        SamPasswordComponent,
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
        { provide: FHService, useValue: fhStub }
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

    fixture = TestBed.createComponent(RegisterMainComponent);
    component = fixture.componentInstance;
  });

  it('verify data-binding for email notification setting', () => {
    let checkbox;

    component.ngOnInit();
    fixture.detectChanges();

    checkbox = fixture.debugElement.query(By.css('#email-notification')).nativeElement

    checkbox.click();
    fixture.detectChanges();
    expect(component.user.emailNotification).toBe(true);

    checkbox.click();
    fixture.detectChanges();
    expect(component.user.emailNotification).toBe(false);
  });
});
