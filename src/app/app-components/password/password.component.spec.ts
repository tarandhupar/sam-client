import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SamUIKitModule } from 'sam-ui-kit';

import { SamPasswordComponent } from './password.component';

const getIcons = ((element: DebugElement) => {
  return {
    minlength: element.query(By.css('.icon.minlength .fa')),
    uppercase: element.query(By.css('.icon.uppercase .fa')),
    numeric: element.query(By.css('.icon.numeric .fa')),
    special: element.query(By.css('.icon.special .fa')),
  };
});

describe('Password Component', () => {
  let component: SamPasswordComponent;
  let fixture: ComponentFixture<SamPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SamUIKitModule,
      ],

      declarations: [
        SamPasswordComponent,
      ],
    });

    fixture = TestBed.createComponent(SamPasswordComponent);
    component = fixture.componentInstance;

    component.reset();
  });

  it('verify icons validation binding', () => {
    let classes = component.config.icons,
        wrapper = fixture.debugElement.query(By.css('.usa-password-progress')),
        icons = getIcons(wrapper),
        icon,
        key;

    component.setSubmitted();
    component.reset();

    fixture.detectChanges();

    for(key in icons) {
      icon = icons[key];

      expect(icon.classes[classes.invalid]).toBeTruthy();
      expect(icon.classes[classes.valid]).toBeFalsy();

      component.states.validations[key] = true;
      fixture.detectChanges();

      expect(icon.classes[classes.invalid]).toBeFalsy();
      expect(icon.classes[classes.valid]).toBeTruthy();
    }
  });

  it('verify icons visibility timing based on submit', () => {
    let classes = component.config.icons,
        wrapper = fixture.debugElement.query(By.css('.usa-password-progress')),
        icons = getIcons(wrapper),
        icon,
        computed,
        key;

    fixture.detectChanges();

    // When form is in 'unsubmitted' state
    for(key in icons) {
      icon = icons[key];
      computed = window.getComputedStyle(icon.nativeElement, null);

      expect(computed.getPropertyValue('visibility')).toBe('hidden');

      // Toggle validation result
      component.states.validations[key] = true;
      fixture.detectChanges();

      expect(computed.getPropertyValue('visibility')).toBe('visible');
    }

    // When form is in 'submitted' state
    component.setSubmitted();
    fixture.detectChanges();

    for(key in icons) {
      icon = icons[key];
      computed = window.getComputedStyle(icon.nativeElement, null);

      expect(computed.getPropertyValue('visibility')).toBe('visible');

      // Toggle validation result
      component.states.validations[key] = false;
      fixture.detectChanges();

      expect(computed.getPropertyValue('visibility')).toBe('visible');
    }
  });
});
