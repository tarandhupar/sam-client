import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-Browser";

// Load the implementations that should be tested
import { SamAlphabetSelectorComponent } from './alphabet-selector.component';

describe("Sam Alphabet Selector Component", ()=>{
  let component: SamAlphabetSelectorComponent;
  let fixture: any;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      declarations: [SamAlphabetSelectorComponent],
    });

    fixture = TestBed.createComponent(SamAlphabetSelectorComponent);
    component = fixture.componentInstance;
  });

  it("should compile",()=>{
    fixture.detectChanges();
    expect(true).toBe(true);
  });
});
