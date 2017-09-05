import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { cloneDeep, merge } from 'lodash';

import { FHService, IAMService, WrapperService } from 'api-kit';

import { SamUIKitModule } from 'sam-ui-kit';
import { AppComponentsModule, AgencyPickerComponent } from 'app-components';
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

describe('[IAM] Sign Up (Main)', () => {
  let component: RegisterMainComponent;
  let fixture: ComponentFixture<RegisterMainComponent>;

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
        RegisterMainComponent,
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

    component.ngOnInit();
    fixture.detectChanges();
  });

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

  it('verify form input bindings', async(() => {
    let form,
        api = TestBed.get(IAMService),
        de = fixture.debugElement,
        kba = de.query(By.css('.kba')).nativeElement,
        mock = {
          title:             null,
          suffix:            '',
          officeID:          '',
          userPassword:      '',
          accountClaimed:    true,
          emailNotification: null,
        },

        questions,
        answers;

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

      mock = merge(mock, {
        firstName: de.query(By.css('#first-name')).nativeElement.value,
        middleName: de.query(By.css('#middle-name')).nativeElement.value,
        lastName: de.query(By.css('#last-name')).nativeElement.value,
        workPhone: de.query(By.css('#phone-number')).nativeElement.value.toString().replace(/[^0-9]/g, ''),
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
      });

      expect(component.userForm.value).toEqual(mock);
    });
  }));

  it('verify population of error messages', () => {
    let error,
        message;

    component.states.alert.type = 'error';
    component.states.alert.message = 'Test Error Message';
    component.states.alert.show = true;

    fixture.detectChanges();

    error = fixture.debugElement.query(By.css('sam-alert'));

    if(error && error.nativeElement) {
      message = error.nativeElement.querySelector('.usa-alert-heading');
    }

    expect(error).toBeDefined();
    expect(message.innerHTML).toBe(component.states.alert.message);
  });
});
