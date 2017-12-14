import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SamUploadComponent } from './upload.component';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `
      <form [formGroup]="form">
        <sam-upload formControlName="file"></sam-upload>
      </form>
    `
})
class TestHostComponent {
  public form: FormGroup = new FormGroup({
    file: new FormControl('')
  });
}

describe('The Sam Upload component', () => {
  let component: SamUploadComponent;
  let host: TestHostComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TestHostComponent, SamUploadComponent, ],
      imports: [ FormsModule, ReactiveFormsModule, ]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    component = fixture.debugElement.query(By.directive(SamUploadComponent)).injector.get(SamUploadComponent);
  });

  it('should disable', () => {
    host.form.get('file').disable();
  })
});
