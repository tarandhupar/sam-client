import { TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertEditComponent } from './alert-edit.component';
import { Alert } from '../alert.model';
import { error } from '../../app-components/alert-header/alerts-test-data.spec';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import * as moment from 'moment';


describe('The <alert-edit> component', () => {
  let component: AlertEditComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertEditComponent ],
      imports: [ SamUIKitModule, RouterTestingModule, FormsModule, ReactiveFormsModule ],
    });

    fixture = TestBed.createComponent(AlertEditComponent);
    component = fixture.componentInstance;
    component.alert = Alert.FromResponse(error);
  });

  it('should compile', () => {
    expect(true).toBe(true);
  });


  describe('Edit Alert tests', function() {
    beforeEach(() => {
      component.mode = 'edit';
      component.alert.setIsExpiresIndefinite(true);
      fixture.detectChanges();
    });

    it('should have edit in the title if the component is in edit mode', () => {
      expect(component.isEditMode()).toBe(true);
      const header = fixture.debugElement.query(By.css('.alert-edit-title'));
      expect(header.nativeElement.textContent).toMatch(/edit/i);
    });

    it('should emit the modified alert on accept', () => {
      let mySpy = spyOn(component.accept, 'emit');
      fixture.debugElement.query(By.css('.usa-button-primary')).nativeElement.click();
      expect(mySpy).toHaveBeenCalled();
    });
  });

  describe('Add Alert tests', function() {
    beforeEach(() => {
      component.mode = 'add';
      fixture.detectChanges();
    });

    it('should have add in the title if the component is in add mode', () => {
      expect(component.isEditMode()).toBe(false);
      const header = fixture.debugElement.query(By.css('.alert-edit-title'));
      expect(header.nativeElement.textContent).toMatch(/add/i);
    });

    it('should be able to end date indefintely', () => {
      expect(component.isEditMode()).toBe(false);
      component.onEndIndefinitelyClick(true);
      expect(component.form.controls['endDate'].disabled).toBe(true);
      expect(component.form.controls['endDate'].value).toBe('');
      component.onEndIndefinitelyClick(false);
      expect(component.form.controls['endDate'].disabled).toBe(false);
    });

    it('should be able to publish alert immediately', () => {
      expect(component.isEditMode()).toBe(false);
      component.onPublishImmediatelyClick(true);
      expect(component.form.get('publishedDate').disabled).toBe(true);
      component.onPublishImmediatelyClick(false);
      expect(component.form.get('publishedDate').disabled).toBe(false);
    });

    it('should be able to detect invalid form', () => {
      let event = new Event('test');
      component.form.get('publishedDate').setValue(moment().subtract(1,'day').format('YYYY-MM-DDTHH:mm:ss'));
      component.onAcceptClick(event);
      expect(component.form.valid).toBe(false);
    });

    it('should be able to cancel form', () => {
      let event = new Event('cancel');
      component.cancel.subscribe(data => {
        expect(data).toEqual(null);
      });
      component.onCancelClick(event);
    })
  });
});
