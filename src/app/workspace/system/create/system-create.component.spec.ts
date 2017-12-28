import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { AppComponentsModule } from 'app-components/app-components.module';
import { PipesModule } from 'app-pipes/app-pipes.module';

import { SystemCreateComponent } from './system-create.component';
import { EditComponent, ReviewComponent } from './tabs';
import {
  SystemInformationComponent,
  OrganizationComponent,
  PermissionsComponent,
  SecurityComponent,
  AuthorizationComponent,
} from './tabs/sections';

import { FHService } from 'api-kit/fh/fh.service';
import { FHServiceMock } from 'api-kit/fh/fh.service.mock';

describe('[IAM] System Account Application', () => {
  let component: SystemCreateComponent,
      fixture: ComponentFixture<SystemCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        SamUIKitModule,
        AppComponentsModule,
        PipesModule,
      ],

      declarations: [
        SystemCreateComponent,
        EditComponent,
        ReviewComponent,
        SystemInformationComponent,
        OrganizationComponent,
        PermissionsComponent,
        SecurityComponent,
        AuthorizationComponent,
      ],

      providers: [
        { provide: FHService, useClass: FHServiceMock },
      ]
    });

    fixture = TestBed.createComponent(SystemCreateComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('verify "Review" button click', async(() => {
    let button;

    component.states.section = component.store.nav.children.length - 1;
    fixture.detectChanges();

    button = fixture.debugElement.query(By.css('.button-review button')).nativeElement;

    spyOn(component, 'review');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.review).toHaveBeenCalled();
    });
  }));

  it('verify "Cancel" button click', async(() => {
    let button = fixture.debugElement.query(By.css('.button-cancel button')).nativeElement;

    spyOn(component, 'cancel');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.cancel).toHaveBeenCalled();
    });
  }));

  it('verify "Next" button click', async(() => {
    let button = fixture.debugElement.query(By.css('.button-next button')).nativeElement;

    spyOn(component, 'next');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.next).toHaveBeenCalled();
    });
  }));

  xit('verify "Approve" & "Reject" buttons showing for users with reviewer role', async(() => {
    let buttons;

    component.user.systemApprover = true;
    component.states.tab = 1;

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      buttons = fixture.debugElement.queryAll(By.css('sam-tabs button'));
      expect(buttons.length).toBe(2);
    });
  }));

  it('verify section navigation is working', () => {
    let menu = fixture.debugElement.query(By.css('.page-content .column.three a.step:nth-child(3)')).nativeElement;

    menu.click();

    fixture.detectChanges();

    expect(component.states.section).toBe(2);
  });

  it('verify error alert is working', () => {
    let error;

    component.setError('Testing');
    fixture.detectChanges();

    error = fixture.debugElement.query(By.css('.page-content sam-alert')).nativeElement

    expect(error).toBeDefined();
  });
});
