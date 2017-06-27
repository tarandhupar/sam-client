import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { SamUIKitModule } from 'sam-ui-kit';
import { PipesModule } from '../../../app-pipes/app-pipes.module';

import { SystemMigrationsComponent } from './system-migrations.component';

describe('[IAM] System Account - Migrations', () => {
  let component: SystemMigrationsComponent;
  let fixture: ComponentFixture<SystemMigrationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        PipesModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        SamUIKitModule
      ],

      declarations: [
        SystemMigrationsComponent
      ]
    });

    fixture = TestBed.createComponent(SystemMigrationsComponent);
    component = fixture.componentInstance;
  });

  it('verify required form fields', () => {
    let controls = [],
        control,
        key;

    component.initForm();

    for(key in component.migrationForm.controls) {
      control = component.migrationForm.controls[key];

      if(control.errors && control.errors.required) {
        controls.push(key);
      }
    }

    expect(controls).toContain('system');
    expect(controls).toContain('username');
    expect(controls).toContain('password');
  });

  xit('verify "Migrate" button click triggers migration event', () => {
    let spy = spyOn(component, 'migrate'),
        button;

    component.initForm();
    fixture.detectChanges();

    button = fixture.nativeElement.querySelector('button[type="submit"]');
    button.click();

    expect(component.migrate).toHaveBeenCalled();
  });
});
