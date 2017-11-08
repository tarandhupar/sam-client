import { DebugElement } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs';
import { merge } from 'lodash';

import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { AppComponentsModule, AgencyPickerComponent } from 'app-components/app-components.module';
import { SystemProfileComponent } from './system-profile.component';

import { FHService, IAMService } from 'api-kit';
import { FHServiceMock } from 'api-kit/fh/fh.service.mock';

describe('[IAM] System Account Profile', () => {
  let component: SystemProfileComponent;
  let fixture: ComponentFixture<SystemProfileComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        SamUIKitModule,
        AppComponentsModule,
      ],

      declarations: [
        SystemProfileComponent,
      ],

      providers: [
        { provide: FHService, useValue: FHServiceMock },
      ]
    });

    TestBed.overrideComponent(AgencyPickerComponent, {
      set: {
        providers: [
          { provide: FHService, useValue: FHServiceMock },
        ]
      }
    });

    fixture = TestBed.createComponent(SystemProfileComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('verify editable state "System-Information"', () => {
    let toggle;

    expect(component.states.sections.system).toBe(false);

    component.states.edit = true;
    fixture.detectChanges();

    toggle = fixture.debugElement.query(By.css('#system-information .usa-edit')).nativeElement;
    toggle.click();

    fixture.detectChanges();

    expect(component.states.sections.system).toBe(true);
  });

  it('verify editable state "Organization-Information"', () => {
    let toggle;

    expect(component.states.sections.organization).toBe(false);

    component.states.edit = true;
    fixture.detectChanges();

    toggle = fixture.debugElement.query(By.css('#organization-information .usa-edit')).nativeElement;
    toggle.click();

    expect(component.states.sections.organization).toBe(true);
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

  it('verify account deactivation', async(() => {
    let button;

    component.states.edit = true;
    fixture.detectChanges();

    button = fixture.debugElement.query(By.css('.deactivate-account sam-button button')).nativeElement;

    spyOn(component, 'confirmDeactivation');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.confirmDeactivation).toHaveBeenCalled();
    });
  }));

  it('verify form input bindings', async(() => {
    let form,
        api = TestBed.get(IAMService),
        de = fixture.debugElement,
        formData,
        mock = {},
        pocs;

    api.iam.system.account.get('test-id', (account) => {
      component.system = account;
      component.initForm();

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        pocs = de.query(By.css('.usa-system-pocs')).nativeElement.querySelectorAll('.usa-system-poc');

        mock = merge(mock, {
          _id: de.query(By.css('#system-id')).nativeElement.value,
          email: de.query(By.css('#system-email')).nativeElement.value,
          systemName: de.query(By.css('#system-name')).nativeElement.value,
          comments: de.query(By.css('#system-comments')).nativeElement.value,
          ipAddress: de.query(By.css('#system-ip')).nativeElement.value,
          primaryOwnerName: de.query(By.css('#system-primary-owner')).nativeElement.value,
          primaryOwnerEmail: de.query(By.css('#system-primary-email')).nativeElement.value,
        });

        formData = component.detailsForm.value;

        delete formData.systemType;
        delete formData.department;
        delete formData.duns;
        delete formData.businessName;
        delete formData.businessAddress;
        delete formData.pointOfContact;

        expect(formData).toEqual(mock);
      });
    });
  }));

  it('verify population of error messages', () => {
    let error,
        message;

    component.states.alert.show = true;
    component.states.alert.message = 'Test Error Message';

    fixture.detectChanges();

    error = fixture.debugElement.query(By.css('form sam-alert'));

    if(error && error.nativeElement) {
      message = error.nativeElement.querySelector('.usa-alert-heading');
    }

    expect(error).toBeDefined();
    expect(message.innerHTML).toBe(component.states.alert.message);
  });
});
