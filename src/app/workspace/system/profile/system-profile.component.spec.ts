import { DebugElement } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { SamUIKitModule } from 'sam-ui-kit';

import { FHService, WrapperService } from 'api-kit';
import { FHWrapperService } from '../../../../api-kit/fh/fhWrapper.service';

import { AgencyPickerComponent } from '../../../app-components/agency-picker/agency-picker.component';
import { SystemProfileComponent } from './system-profile.component';

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

xdescribe('[IAM] SystemProfileComponent]', () => {
  let component: SystemProfileComponent;
  let fixture: ComponentFixture<SystemProfileComponent>;
  let debugElement: DebugElement;

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
        SystemProfileComponent
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

    fixture = TestBed.createComponent(SystemProfileComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  it('verify account deactivation confirmations', () => {
    let buttons = {};

    component.states.edit = true;

    fixture.detectChanges();

    buttons['deactivate'] = fixture.nativeElement.querySelector('#button-deactivate');
    buttons['confirm'] = component.confirmModal;
    buttons['reconfirm'] = component.reconfirmModal;

    expect(buttons['deactivate']).toBeDefined();
    expect(buttons['confirm']).toBeDefined();
    expect(buttons['reconfirm']).toBeDefined();
  });
});
