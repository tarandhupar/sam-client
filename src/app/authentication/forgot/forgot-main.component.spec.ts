import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { AppComponentsModule } from 'app-components/app-components.module';

import { ForgotMainComponent } from './forgot-main.component';

describe('[IAM] Forgot Password (Main)', () => {
  let component: ForgotMainComponent;
  let fixture: ComponentFixture<ForgotMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SamUIKitModule,
        AppComponentsModule,
      ],

      declarations: [
        ForgotMainComponent,
      ],
    });

    fixture = TestBed.createComponent(ForgotMainComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('verify population of error messages', () => {
    let error,
        message;

    component.states.alert.show = true;
    component.states.alert.title = 'Test Error Message';

    fixture.detectChanges();

    error = fixture.debugElement.query(By.css('sam-alert'));

    if(error && error.nativeElement) {
      message = error.nativeElement.querySelector('.usa-alert-heading');
    }

    expect(error).toBeDefined();
    expect(message.innerHTML).toBe(component.states.alert.title);
  });
});
