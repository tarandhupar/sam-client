import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';

import { ForgotInitialComponent } from './forgot-initial.component';

describe('[IAM] Forgot Password (Initial)', () => {
  let component: ForgotInitialComponent;
  let fixture: ComponentFixture<ForgotInitialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SamUIKitModule,
      ],

      declarations: [
        ForgotInitialComponent,
      ],
    });

    fixture = TestBed.createComponent(ForgotInitialComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('verify population of error messages', () => {
    let error,
        message;

    component.states.notification.show = true;
    component.states.notification.title = 'Test Error Message';

    fixture.detectChanges();

    error = fixture.debugElement.query(By.css('sam-alert'));

    if(error && error.nativeElement) {
      message = error.nativeElement.querySelector('.usa-alert-heading');
    }

    expect(error).toBeDefined();
    expect(message.innerHTML).toBe(component.states.notification.title);
  });
});
