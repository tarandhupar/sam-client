import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login.component';

describe('[IAM] Sign In', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],

      declarations: [
        LoginComponent,
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('verify population of error messages', () => {
    let error,
        message;

    component.states.submitted = true;
    component.errors.global.push('Test Error Message')

    fixture.detectChanges();

    error = fixture.debugElement.query(By.css('.usa-input-error-message:nth-child(1)'));

    expect(error).toBeDefined();
    expect(error.nativeElement.innerHTML).toBe(component.errors.global[0]);
  });
});
