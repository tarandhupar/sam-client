import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-Browser";
import {Observable} from 'rxjs';
import { RouterTestingModule } from "@angular/router/testing";

// Load the implementations that should be tested
import { SamAlphabetSelectorComponent } from './alphabet-selector.component';
import { AlphabetSelectorService } from "api-kit";


fdescribe("Sam Alphabet Selector Component", ()=>{

  let defaultInfo = Observable.of({
    resultSizeByAlphabet:{A:200, E:200, F:20000, Z:1000},
    resultData:[
      {LastName:'Allen', FirstName:'A'},
      {LastName:'Allen', FirstName:'B'},
      {LastName:'Allen', FirstName:'C'},
    ]
  });

  let alphabetServiceStub: any = {
    getDefault: () => defaultInfo
  };

  let component: SamAlphabetSelectorComponent;
  let fixture: any;

  beforeEach(()=>{
    TestBed.configureTestingModule({

      declarations: [SamAlphabetSelectorComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: AlphabetSelectorService, useValue: alphabetServiceStub }]
    });

    fixture = TestBed.createComponent(SamAlphabetSelectorComponent);
    component = fixture.componentInstance;
  });

  it("should compile",()=>{
    fixture.detectChanges();
    expect(true).toBe(true);
  });
});
