import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

// Load the implementations that should be tested
import { HelpModule } from "../help.module"
import { ImageLibraryComponent } from "./image-library.component";

describe('Image Library Component', () => {
  let component:ImageLibraryComponent;
  let fixture:any;
  let dataConfig:any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageLibraryComponent],
      imports: [HelpModule, RouterTestingModule]

    });
    fixture = TestBed.createComponent(ImageLibraryComponent);
    component = fixture.componentInstance;
    dataConfig = [
      {
        title:"Federal Acquisition Regulation",
        detail:"Details for Federal Acquisition Regulation: "+this.detailLipsum,
        link:"View FAR",
        url:"https://www.acquisition.gov/?q=browsefar",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"SBA Commercial Market Representative",
        detail:"Details for SBA Commercial Market Representative: "+this.detailLipsum,
        link:"View SBA CMR",
        url:"https://www.sba.gov/contracting/resources-small-businesses/commercial-market-representatives",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Request DUNS Number",
        detail:"Details for Request DUNS Number: "+this.detailLipsum,
        link:"View DUNS Number",
        url:"http://fedgov.dnb.com/webform",
        img:"src/assets/img/placeholder.jpg"
      }
    ];
    component.data = dataConfig;
    component.name = "contract";
  });

  it('should open detail when clicking on icon', ()=> {
    fixture.detectChanges();
    expect(component.detailObj.showDetail).toBe(false);
    fixture.nativeElement.querySelector('#contract-icon-0').click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let contractDetail = fixture.debugElement.query(By.css(".detail-text"));
      expect(contractDetail.nativeElement.innerHTML).toBe(dataConfig[0].detail);
      expect(component.detailObj.showDetail).toBe(true);
    });
  });

  it('should open detail when clicking on link', ()=> {
    fixture.detectChanges();
    expect(component.detailObj.showDetail).toBe(false);
    fixture.nativeElement.querySelector('#contract-link-0').click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let contractDetail = fixture.debugElement.query(By.css(".detail-text"));
      expect(contractDetail.nativeElement.innerHTML).toBe(dataConfig[0].detail);
      expect(component.detailObj.showDetail).toBe(true);
    });
  });

  it('should open detail when clicking on semi-transparent div', ()=> {
    fixture.detectChanges();
    expect(component.detailObj.showDetail).toBe(false);
    fixture.nativeElement.querySelector('#contract-div-0').click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let contractDetail = fixture.debugElement.query(By.css(".detail-text"));
      expect(contractDetail.nativeElement.innerHTML).toBe(dataConfig[0].detail);
      expect(component.detailObj.showDetail).toBe(true);
    });
  });

  it('should hide detail when clicking on the same icon while the corresponding detail is open', ()=> {
    component.detailObj.showDetail = true;
    component.detailObj.item = dataConfig[0];
    fixture.detectChanges();
    let contractDetail = fixture.debugElement.query(By.css(".detail-text"));
    expect(contractDetail.nativeElement.innerHTML).toBe(dataConfig[0].detail);
    fixture.nativeElement.querySelector('#contract-icon-0').click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.detailObj.showDetail).toBe(false);
    });
  });

  it('should hide detail when clicking on the close link while the corresponding detail is open', ()=> {
    component.detailObj.showDetail = true;
    component.detailObj.item = dataConfig[0];
    fixture.detectChanges();
    let contractDetail = fixture.debugElement.query(By.css(".detail-text"));
    expect(contractDetail.nativeElement.innerHTML).toBe(dataConfig[0].detail);
    fixture.nativeElement.querySelector('.image-library-close').click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.detailObj.showDetail).toBe(false);
    });
  });
});
