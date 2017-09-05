import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SamUIKitModule } from 'sam-ui-kit';
import { AppComponentsModule } from 'app-components';
import { PipesModule } from 'app-pipes/app-pipes.module';

import { MigrationsComponent } from './migrations.component';

describe('[IAM] User Profile - Migrations', () => {
  let component: MigrationsComponent;
  let fixture: ComponentFixture<MigrationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SamUIKitModule,
        AppComponentsModule,
        PipesModule,
      ],

      declarations: [
        MigrationsComponent,
      ],
    });

    fixture = TestBed.createComponent(MigrationsComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('verify population of error messages', () => {
    let error,
        message;

    component.states.confirm.show = true;
    component.states.confirm.message = 'Test Error Message';

    fixture.detectChanges();

    error = fixture.debugElement.query(By.css('form sam-alert'));

    if(error && error.nativeElement) {
      message = error.nativeElement.querySelector('.usa-alert-heading');
    }

    expect(error).toBeDefined();
    expect(message.innerHTML).toBe(component.states.confirm.message);
  });
});
