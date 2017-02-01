import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

// Load the implementations that should be tested
import { NewToSamComponent } from "./new-to-sam.component";
import { HelpModule } from "../../help.module";

describe("New to Sam.gov page in help page", ()=>{
  let component: NewToSamComponent;
  let fixture: any;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      providers:[NewToSamComponent],
      imports:[HelpModule, RouterTestingModule]
    });

    fixture = TestBed.createComponent(NewToSamComponent);
    component = fixture.componentInstance;
  });

  it("should compile without error", ()=>{
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it("should open image library when click on big button", ()=>{
    fixture.detectChanges();
    fixture.whenStable().then(()=>{
      expect(component.showImageLibrary).toBe(false);
      fixture.nativeElement.querySelector('.square-button').click();

      fixture.detectChanges();
      expect(component.showImageLibrary).toBe(true);
    });
  });

  it("should close image library when click on go back link", ()=>{
    component.showImageLibrary = true;
    component.openImageLibrary('area1');
    fixture.detectChanges();
    fixture.whenStable().then(()=>{
      fixture.nativeElement.querySelector('.fa-arrow-circle-o-left').click();

      fixture.detectChanges();
      expect(component.showImageLibrary).toBe(false);
    });
  });

});
