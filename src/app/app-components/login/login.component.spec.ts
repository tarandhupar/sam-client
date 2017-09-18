import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SamLoginComponent } from './login.component';

describe('[IAM] Sign In', () => {
  let component: SamLoginComponent;
  let fixture: ComponentFixture<SamLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],

      declarations: [
        SamLoginComponent,
      ],
    });

    fixture = TestBed.createComponent(SamLoginComponent);
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
