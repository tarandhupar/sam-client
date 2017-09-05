import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { SamUIKitModule } from 'sam-ui-kit';
import { AppComponentsModule } from 'app-components';

import { SystemPasswordComponent } from './system-password.component';

describe('[IAM] System Password Reset', () => {
  let component: SystemPasswordComponent,
      fixture: ComponentFixture<SystemPasswordComponent>;

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
        SystemPasswordComponent,
      ],
    });

    fixture = TestBed.createComponent(SystemPasswordComponent);
    component = fixture.componentInstance;

    component.initForm();
    fixture.detectChanges();
  });

  it('verify password reset', async(() => {
    let button = fixture.debugElement.query(By.css('.usa-button-controls button[type="submit"]')).nativeElement;

    spyOn(component, 'reset');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.reset).toHaveBeenCalled();
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
