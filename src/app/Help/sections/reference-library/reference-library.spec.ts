import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

// Load the implementations that should be tested
import { ReferenceLibraryComponent } from "./reference-library.component";
import { HelpModule } from "../../help.module";

describe('Reference Library page in online help', () => {
  let component:ReferenceLibraryComponent;
  let fixture:any;
  let federalItemConfig: any;
  let contractItemConfig: any;
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReferenceLibraryComponent],
      imports: [HelpModule,RouterTestingModule]

    });
    fixture = TestBed.createComponent(ReferenceLibraryComponent);
    component = fixture.componentInstance;
    federalItemConfig = {
      title:"Data Element Repository",
      detail:"Details for Data Element Repository: "+component.detailLipsum,
      link:"view the e-CFR",
      url:"fakeUrl"
    };

    contractItemConfig = {
      title:"Federal Acquisition Regulation",
      detail:"Details for Federal Acquisition Regulation: "+component.detailLipsum,
      link:"view the FAR",
      url:"fakeUrl"
    };
  });

  it('should compile', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should contain featured references section and additional references section', ()=>{
    fixture.detectChanges();
    let featuredRef = fixture.debugElement.query(By.css('#featuredReference'));
    let additionalRef = fixture.debugElement.query(By.css('#additionalReference'));
    expect(featuredRef).toBeDefined();
    expect(featuredRef.nativeElement.innerHTML).toBe("Featured References");
    expect(additionalRef).toBeDefined();
    expect(additionalRef.nativeElement.innerHTML).toBe("Additional References");
  });
  
});
