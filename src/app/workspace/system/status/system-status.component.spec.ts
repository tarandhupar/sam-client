import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { SamUIKitModule } from 'sam-ui-kit';
import { AppComponentsModule } from 'app-components/app-components.module';

import { SystemStatusComponent } from './system-status.component';

describe('[IAM] System Account Application Requests', () => {
  let component: SystemStatusComponent,
      fixture: ComponentFixture<SystemStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        SamUIKitModule,
        AppComponentsModule,
      ],

      declarations: [
        SystemStatusComponent,
      ],
    });

    fixture = TestBed.createComponent(SystemStatusComponent);
    component = fixture.componentInstance;
  });

  it('[Stages][Draft] verify progress bar is rendered correctly for ', () => {
    let icons;

    component.application.applicationStatus = 'draft';
    fixture.detectChanges();

    icons = fixture.debugElement.queryAll(By.css('.usa-progress-bar .fa'));
    expect(icons.length).toBe(0);
  });

  it('[Stages][Pending] verify progress bar is rendered correctly for ', () => {
    let icons;

    component.application.applicationStatus = 'pending approval';
    fixture.detectChanges();

    icons = fixture.debugElement.queryAll(By.css('.usa-progress-bar .fa'));
    expect(icons.length).toBe(1);
  });

  it('[Stages][Approved/Rejection] verify progress bar is rendered correctly for ', () => {
    let icons;

    component.application.applicationStatus = 'approved';
    fixture.detectChanges();

    icons = fixture.debugElement.queryAll(By.css('.usa-progress-bar .fa'));
    expect(icons.length).toBe(2);
  });
});
