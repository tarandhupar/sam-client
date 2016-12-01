import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

// Load the implementations that should be tested
import { ReferenceLibraryComponent } from "./reference-library.component";
import { HelpModule } from "../../help.module"

describe('Reference Library page in online help', () => {
  let component:ReferenceLibraryComponent;
  let fixture:any;

  let federalItemConfig = {
    title:"Data Element Repository",
    detail:"Details for Data Element Repository: ",
  };

  let contractItemConfig = {
    title:"Federal Acquisition Regulation",
    detail:"Details for Data Element Repository: ",
  };

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReferenceLibraryComponent],
      imports: [HelpModule,RouterTestingModule]

    });
    fixture = TestBed.createComponent(ReferenceLibraryComponent);
    component = fixture.componentInstance;
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

  it('should toggle federal assistance detail when clicking on federal assistance image, link or icon', ()=>{
    fixture.detectChanges();
    expect(component.detailObj.Federal.showDetail).toBe(false);
    component.selectDetail(federalItemConfig,"Federal");
    expect(component.detailObj.Federal.showDetail).toBe(true);
    component.selectDetail(federalItemConfig,"Federal");
    expect(component.detailObj.Federal.showDetail).toBe(false);
  });

  it('should open contract detail when clicking on contract image',  ()=>{
    fixture.detectChanges();
    expect(component.detailObj.Contract.showDetail).toBe(false);
    let imageLink = fixture.debugElement.query(By.css("#contract-image-0"));
    imageLink.triggerEventHandler('click',null);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let contractDetail = fixture.debugElement.query(By.css(".contract-detail"));
      expect(contractDetail.nativeElement.innerHTML).toBe(contractItemConfig.detail+component.detailLipsum);
      expect(component.detailObj.Contract.showDetail).toBe(true);
    });

  });

  it('should hide contract detail when clicking on the same contract image while the corresponding detail is open', ()=>{
    component.detailObj.Contract.showDetail = true;
    component.detailObj.Contract.title = contractItemConfig.title;
    component.detailObj.Contract.detail = contractItemConfig.detail+component.detailLipsum;
    fixture.detectChanges();
    let contractDetail = fixture.debugElement.query(By.css(".contract-detail"));
    expect(contractDetail.nativeElement.innerHTML).toBe(contractItemConfig.detail+component.detailLipsum);
    let imageLink = fixture.debugElement.query(By.css("#contract-image-0"));
    imageLink.triggerEventHandler('click',null);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.detailObj.Contract.showDetail).toBe(false);
    });
  });

});
