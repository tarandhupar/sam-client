import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser/index';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import SamUIKitModule from 'sam-ui-kit'
//import { IAMService } from 'api-kit';
import { SystemProfileComponent } from './system-profile.component';

fdescribe('[IAM] System Account - Profile', () => {
  let component: SystemProfileComponent;
  let fixture: ComponentFixture<SystemProfileComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SamUIKitModule],
      declarations: [SystemProfileComponent]
    });

    fixture = TestBed.createComponent(SystemProfileComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('verify account deactivation confirmations', () => {
    let buttons = {};

    component.states.edit = true;
    fixture.detectChanges();

    buttons['deactivate'] = debugElement.query(By.css('#button-deactivate button'));
    buttons['confirm'] = component.confirmModal;
    buttons['reconfirm'] = component.reconfirmModal;

    expect(buttons['deactivate']).toBeTruthy();

    //usa-modal-content-submit-btn
    //usa-modal-content-cancel-btn

    //el.nativeElement.dispatchEvent(new Event('keydown'));//keydown update the model component model value
    //fixture.detectChanges();
    //expect(component.model).toBe("1+(234)213-4213");
  });
});
