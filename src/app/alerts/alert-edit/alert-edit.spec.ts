import {TestBed, ComponentFixtureAutoDetect} from '@angular/core/testing';

// Load the implementations that should be tested
import {SamUIKitModule} from 'ui-kit';
import {RouterTestingModule} from "@angular/router/testing";
import {AlertEditComponent} from "./alert-edit.component";
import {Alert} from "../alert.model";
import {error} from '../alerts-test-data.spec';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {By} from "@angular/platform-browser";


describe('The <alert-edit> component', () => {
  let component:AlertEditComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertEditComponent],
      imports: [SamUIKitModule,RouterTestingModule,FormsModule,ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(AlertEditComponent);
    component = fixture.componentInstance;
    component.alert = Alert.FromResponse(error);
  });

  it('should compile', () => {
    expect(true).toBe(true);
  });


  describe('Edit tests', function() {
    beforeEach(() => {
      component.mode = 'edit';
      fixture.detectChanges();
    });

    it('should have edit in the title if the component is in edit mode', () => {
      const header = fixture.debugElement.query(By.css('.alert-edit-title'));
      expect(header.nativeElement.textContent).toMatch(/edit/i);
    });

    it('should emit the modified alert on accept', () => {
      let mySpy = spyOn(component.accept, 'emit');
      fixture.debugElement.query(By.css('.alert-confirm-button')).nativeElement.click();
      expect(mySpy).toHaveBeenCalled();
    });
  });

  describe('Add tests', function() {
    beforeEach(() => {
      component.mode = 'add';
      fixture.detectChanges();
    });

    it('should have add in the title if the component is in add mode', () => {
      const header = fixture.debugElement.query(By.css('.alert-edit-title'));
      expect(header.nativeElement.textContent).toMatch(/add/i);
    });
  });
});
