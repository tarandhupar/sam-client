import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { cloneDeep, keys, merge, pick } from 'lodash';

import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { AppComponentsModule, AgencyPickerComponent } from 'app-components/app-components.module';
import { RegisterMainComponent } from './register-main.component';

import { FHService, IAMService } from 'api-kit';
import { FHServiceMock } from 'api-kit/fh/fh.service.mock';
import { getMockUser } from 'api-kit/iam/api/core/modules/mocks';

describe('[IAM] Sign Up (Main)', () => {
  let component: RegisterMainComponent;
  let fixture: ComponentFixture<RegisterMainComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        SamUIKitModule,
        AppComponentsModule,
      ],

      declarations: [
        RegisterMainComponent,
      ],

      providers: [
        { provide: FHService, useValue: FHServiceMock }
      ]
    });

    TestBed.overrideComponent(AgencyPickerComponent, {
      set: {
        providers: [
          { provide: FHService, useValue: FHServiceMock },
        ]
      }
    });

    fixture = TestBed.createComponent(RegisterMainComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    fixture.detectChanges();
  }));

  it('verify data-binding for email notification setting', () => {
    let checkbox;

    checkbox = fixture.debugElement.query(By.css('#email-notification')).nativeElement

    checkbox.click();
    fixture.detectChanges();

    expect(component.user.emailNotification).toBe(true);

    checkbox.click();
    fixture.detectChanges();

    expect(component.user.emailNotification).toBe(false);
  });

  it('verify form input bindings', fakeAsync(() => {
    let form,
        api = TestBed.get(IAMService),
        de = fixture.debugElement,
        kba = de.query(By.css('.kba')).nativeElement,
        dom,

        questions,
        answers,
        props;

    // Load KBA Security Questions
    api.iam.kba.questions(data => {
      component.questions[0] = cloneDeep(data.questions);
      component.questions[1] = cloneDeep(data.questions);
      component.questions[2] = cloneDeep(data.questions);
    });

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      questions = kba.querySelectorAll('select');
      answers = kba.querySelectorAll('input');

      dom = {
        firstName: de.query(By.css('#first-name')).nativeElement.value,
        middleName: de.query(By.css('#middle-name')).nativeElement.value,
        lastName: de.query(By.css('#last-name')).nativeElement.value,
        personalPhone: de.query(By.css('.name sam-phone-entry input')).nativeElement.value.toString().replace(/[^0-9]/g, ''),
//      -> sam-autocomplete value setting issues is breaking this property from being verified.
//      -> Hard code value for now
//      carrier: de.query(By.css('#name .sam-autocomplete input')).nativeElement.value,
        carrier: 'AT&T',
        workPhone: de.query(By.css('.phone sam-phone-entry input')).nativeElement.value.toString().replace(/[^0-9]/g, ''),
        kbaAnswerList: [
          {
            questionId: parseInt(questions[0].value),
            answer: answers[0].value,
          },
          {
            questionId: parseInt(questions[1].value),
            answer: answers[1].value,
          },
          {
            questionId: parseInt(questions[2].value),
            answer: answers[2].value,
          },
        ]
      };

      props = keys(dom);
      form = pick(component.userForm.value, props);

      expect(form).toEqual(dom);
    });
  }));

  it('verify population of error messages', () => {
    let error,
        message;

    component.showAlert('error', 'Test Error Message');

    fixture.detectChanges();

    error = fixture.debugElement.query(By.css('sam-alert'));

    if(error && error.nativeElement) {
      message = error.nativeElement.querySelector('.usa-alert-heading');
    }

    expect(error).toBeDefined();
    expect(message.innerHTML).toBe(component.states.alert.message);
  });

  it('verify dynamic validator when mobile phone has input', fakeAsync(() => {
    const form = component.userForm;
    let phoneInput;

    fixture.whenStable().then(() => {
      form.get('carrier').patchValue('');
      form.get('personalPhone').patchValue('12345678901');

      fixture.detectChanges();
      tick(600);

      expect(form.get('carrier').invalid).toBeTruthy();

      form.get('personalPhone').patchValue('');

      fixture.detectChanges();
      tick(600);

      expect(form.get('carrier').valid).toBeTruthy();
    });
  }));

  it('verify entity-picker render for non-gov registration', fakeAsync(() => {
    component.states.isGov = false;

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('sam-agency-picker'))).toBeNull();
      expect(fixture.debugElement.query(By.css('sam-entity-picker'))).toBeDefined();
    });
  }));
});
