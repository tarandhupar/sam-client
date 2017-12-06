import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

// Load the implementations that should be tested
import { OverviewComponent } from "./overview.component";
import { HelpModule } from "../../help.module";

describe("New to Sam.gov page in help page", ()=>{
  let component: any;
  let fixture: any;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      providers:[OverviewComponent],
      imports:[HelpModule, RouterTestingModule]
    });

    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
  });

  it('should compile without error', ()=>{
    fixture.detectChanges();
    expect(true).toBe(true);
  });
  it('should initialize feedback to form service instance', () => {
    expect(component.feedback).toEqual(component.formService.componentInstance);
  });


});
