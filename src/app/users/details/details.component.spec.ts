import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { AppComponentsModule, AgencyPickerComponent } from 'app-components/app-components.module';
import { DetailsComponent } from './details.component';

import { FHService } from 'api-kit';
import { FHServiceMock } from 'api-kit/fh/fh.service.mock';

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

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    fixture.detectChanges();
  });

  xit('verify data-binding for email notification setting', () => {
    let checkbox;

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

    component.alert('identity', 'error', 'Test Error Message');

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

    component.alert('business', 'error', 'Test Error Message');

    fixture.detectChanges();

    error = fixture.debugElement.query(By.css('#business sam-alert'));

    if(error && error.nativeElement) {
      message = error.nativeElement.querySelector('.usa-alert-heading');
    }

    expect(error).toBeDefined();
    expect(message.innerHTML).toBe(component.alerts.business.message);
  });

  it('verify dynamic validator when mobile phone has input', fakeAsync(() => {
    let controls = {
          personalPhone: component.detailsForm.get('personalPhone'),
          carrier: component.detailsForm.get('carrier'),
        };

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      controls.personalPhone.setValue('12345678901');
      tick();

      expect(controls.carrier.invalid).toBeTruthy();

      controls.personalPhone.setValue('');
      tick();

      expect(controls.carrier.invalid).toBeFalsy();
    });
  }));
});
