import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

// Load the implementations that should be tested
import { NewToSamComponent } from "./new-to-sam.component";
import { HelpModule } from "../../help.module";

xdescribe("New to Sam.gov page in help page", ()=>{
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


});
