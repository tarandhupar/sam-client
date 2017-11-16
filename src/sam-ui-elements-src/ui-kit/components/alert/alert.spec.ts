import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {SimpleChanges} from '@angular/core';

// Load the implementations that should be tested
import {SamAlertComponent} from './alert.component';

let defaultConfig = {
  type: 'success',
  title: 'i-am-a-title',
  description: 'i-am-a-description',
};

describe('The Sam Alert component', () => {
  describe('isolated tests', ()=>{
    let component:SamAlertComponent;
    beforeEach(()=>{
      component = new SamAlertComponent();
    });
    
    it('should toggleContent',()=>{
      component.showMoreToggle = false;
      component.toggleContent();
      expect(component.showMoreToggle).toBe(true);
      expect(component.showMoreLinkText).toBe('Hide Details');
      component.toggleContent();
      expect(component.showMoreToggle).toBe(false);
      expect(component.showMoreLinkText).toBe('Show Details');
      
    });

    it('should trigger dismiss on timer',()=>{
      component.dismissTimer = 100;
      component.dismiss.subscribe(()=>{
        //should get here
        expect(true).toBe(true);
      });
      component.ngOnInit();
    });
    it('should trigger dismiss on method', ()=>{
      component.dismiss.subscribe(()=>{
        expect(true).toBe(true);
      });
      component.closeAlert();
    });
    it('should check if type is defined', ()=>{
      expect(component.typeNotDefined()).toBe(true);
      component.type = 'notAValidType';
      expect(component.typeNotDefined()).toBe(true);
      component.type = 'success';
      expect(component.typeNotDefined()).toBe(false);
      component.ngOnInit();
      expect(component.selectedType).toBe("usa-alert-success");
    });
  });
  describe('rendered tests', ()=>{
    let component:SamAlertComponent;
    let fixture:any;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [SamAlertComponent],
      });
  
      fixture = TestBed.createComponent(SamAlertComponent);
      component = fixture.componentInstance;
      component.type = defaultConfig.type;
      component.title = defaultConfig.title;
      component.description = defaultConfig.description;
      fixture.detectChanges();
  
    });
  
    it('title + description check', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.debugElement.query(By.css('.usa-alert-heading')).nativeElement.textContent.trim()).toBe("i-am-a-title");
        expect(fixture.debugElement.query(By.css('.usa-alert-text')).nativeElement.textContent.trim()).toBe("i-am-a-description");
      });
    });
    it('type check', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.debugElement.query(By.css('.usa-alert')).nativeElement.className).toContain("usa-alert-success");
      });
    });
  });
});