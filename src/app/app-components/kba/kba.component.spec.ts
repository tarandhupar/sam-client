import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { IAMService } from 'api-kit';

import { SamKBAComponent } from './kba.component';

describe('SamKBAComponent', () => {
  let component: SamKBAComponent,
      fixture: ComponentFixture<SamKBAComponent>,
      api: IAMService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SamUIKitModule
      ],

      declarations: [
        SamKBAComponent,
      ],
    });

    fixture = TestBed.createComponent(SamKBAComponent);
    component = fixture.componentInstance;
    api = new IAMService();

    api.iam.kba.questions(data => {
      component.questions = data.questions;
    });

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('verify security answer validation is required', () => {
    component.answer.patchValue('');
    expect(component.answer.valid).toBe(false);
  });

  it('verify security answer validation has minlength', () => {
    component.answer.patchValue('12345678');
    expect(component.answer.valid).toBe(true);
  });
});
