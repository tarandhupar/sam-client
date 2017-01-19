import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-Browser";
import { Observable } from 'rxjs';
import { RouterTestingModule } from "@angular/router/testing";

// Load the implementations that should be tested
import { SamAlphabetSelectorComponent,AlphabetSelectorService } from './alphabet-selector.component';

class AlphabetServiceStub implements AlphabetSelectorService{
  drillDownLimitLength: number = 3; // the limit level of drill down
  pageCount:number = 4; // total number of items in per page

  constructor(){}

  getData(checkPrefix:boolean, prefix?:string, offset?:number):any{
    return Observable.of({
      resultSizeByAlphabet:{A:200, E:200, F:20000, Z:1000},
      resultData:[
        {LastName:'Allen', FirstName:'A'},
        {LastName:'Allen', FirstName:'B'},
        {LastName:'Allen', FirstName:'C'}
      ]
    });
  }
};

fdescribe("Sam Alphabet Selector Component", ()=>{

  let alphabetServiceStub: AlphabetServiceStub = new AlphabetServiceStub();
  let component: SamAlphabetSelectorComponent;
  let fixture: any;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      declarations: [SamAlphabetSelectorComponent],
      imports: [RouterTestingModule],
      providers: []
    });

    fixture = TestBed.createComponent(SamAlphabetSelectorComponent);
    component = fixture.componentInstance;
    component.alphabetSelectorService = alphabetServiceStub;
  });

  it("should compile",()=>{
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it("should be able to click a prefix to make it selected", ()=>{
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.pre-selected-prefix').click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let selectedPrefix = fixture.debugElement.query(By.css(".selected-prefix"));
      selectedPrefix.nativeElement.innerHTML.toBe("A");
    });
  });

  it("should have correct valid prefix and pre selected prefix", ()=>{
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      let normalPrefixs = fixture.debugElement.queryAll(By.css(".normal-prefix"));
      let preSelectedPrefix = fixture.debugElement.query(By.css(".pre-selected-prefix"));
      expect(normalPrefixs.length).toBe(3);
      expect(preSelectedPrefix.nativeElement.innerHTML).toBe("A");
    });
  });

  it("should get the default layer set up", ()=>{
    fixture.detectChanges();
    expect(component.resultData.length).toBe(3);
    expect(component.layersData.length).toBe(1);
  });

  it("should get the second layer with prefix set to A", ()=>{
    fixture.detectChanges();
    component.currentPrefix = 'A';
    component.fetchPrefixData();
    expect(component.layersData.length).toBe(2);
    expect(component.resultData.length).toBe(3);
    expect(component.resultData[0].LastName).toBe('Allen');
  });


});
