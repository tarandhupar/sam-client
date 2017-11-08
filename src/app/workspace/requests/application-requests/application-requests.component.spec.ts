import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { SamUIKitModule } from 'sam-ui-kit';
import { AppComponentsModule } from 'app-components/app-components.module';

import { ApplicationRequestsComponent } from './application-requests.component';
import { ReviewComponent } from 'workspace/system/create/tabs';

describe('[IAM] System Account Application Requests', () => {
  let component: ApplicationRequestsComponent,
      fixture: ComponentFixture<ApplicationRequestsComponent>;

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
        ApplicationRequestsComponent,
        ReviewComponent,
      ],
    });

    fixture = TestBed.createComponent(ApplicationRequestsComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    component.initForm();

    fixture.detectChanges();
  });

  it('verify "Close" button click', async(() => {
    let button = fixture.debugElement.query(By.css('.button-close button')).nativeElement;

    spyOn(component, 'close');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.close).toHaveBeenCalled();
    });
  }));

  it('verify "Approve" button click', async(() => {
    let button = fixture.debugElement.query(By.css('.button-approve button')).nativeElement;

    spyOn(component, 'approve');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.approve).toHaveBeenCalled();
    });
  }));

  it('verify "Reject" button click', async(() => {
    let button = fixture.debugElement.query(By.css('.button-reject button')).nativeElement;

    spyOn(component, 'reject');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.reject).toHaveBeenCalled();
    });
  }));

  it('verify error alert is working', () => {
    let error;

    component.setError('Testing');
    fixture.detectChanges();

    error = fixture.debugElement.query(By.css('.page-content sam-alert')).nativeElement

    expect(error).toBeDefined();
  });
});
