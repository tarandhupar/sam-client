import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { RegisterInitialComponent } from './register-initial.component';

describe('[IAM] Sign Up (Initial)', () => {
  let component: RegisterInitialComponent;
  let fixture: ComponentFixture<RegisterInitialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],

      declarations: [
        RegisterInitialComponent,
      ],
    });

    fixture = TestBed.createComponent(RegisterInitialComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('verify population of error messages', () => {
    let error,
        message;

    component.states.submitted = true;
    component.states.error = 'Test Error Message';

    fixture.detectChanges();

    error = fixture.debugElement.query(By.css('.usa-input-error-message'));

    if(error && error.nativeElement) {
      message = error.nativeElement.querySelector('span:nth-child(1)');
    }

    expect(error).toBeDefined();
    expect(message.innerHTML).toBe(component.states.error);
  });
});
