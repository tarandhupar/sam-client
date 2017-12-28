import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponentsModule } from 'app-components/app-components.module';
import { SamLoginComponent } from './login.component';

import { IAMService } from 'api-kit';

describe('[IAM] Sign In', () => {
  let component: SamLoginComponent;
  let fixture: ComponentFixture<SamLoginComponent>;
  let api: IAMService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        AppComponentsModule,
      ],
    });

    fixture = TestBed.createComponent(SamLoginComponent);
    component = fixture.componentInstance;
    api = TestBed.get(IAMService);

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('verify population of API error messages', () => {
    let error,
        message;

    component.states.submitted = true;
    component.errors.push('Test Error Message')

    fixture.detectChanges();

    error = fixture.debugElement.query(By.css('.usa-login fieldset > .usa-input-error-message:nth-child(1)'));

    expect(error).toBeDefined();
    expect(error.nativeElement.innerHTML).toBe(component.getError());
  });

  it('verify stage 1 is properly rendered [Stage 1 - Username/Password]', () => {
    let stage = 1,
        dom = fixture.debugElement.query(By.css(`.usa-login .stage-${stage}`));

    expect(dom).toBeDefined();
    expect(api.iam.stage).toBe(stage);
  });

  it('verify stage is properly rendered [Stage 2 - OTP Method]', () => {
    let stage = 2,
        dom = fixture.debugElement.query(By.css(`.usa-login .stage-${stage}`));

    api.iam.login();

    fixture.detectChanges();

    expect(dom).toBeDefined();
    expect(api.iam.stage).toBe(stage);
  });

  it('verify stage is properly rendered [Stage 3 - OTP]', () => {
    let stage = 3,
        dom = fixture.debugElement.query(By.css(`.usa-login .stage-${stage}`));

    api.iam.login();
    api.iam.login();

    fixture.detectChanges();

    expect(dom).toBeDefined();
    expect(api.iam.stage).toBe(stage);
  });
});
