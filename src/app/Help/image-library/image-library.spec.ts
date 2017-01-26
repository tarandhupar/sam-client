import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

// Load the implementations that should be tested
import { HelpModule } from "../help.module"
import { ImageLibraryComponent } from "./image-library.component";

describe('Image Library Component', () => {
  let component:ImageLibraryComponent;
  let fixture:any;
  let dataConfig = [
    {
      title:"Federal Acquisition Regulation",
      detail:"Details for Federal Acquisition Regulation: ",
      link:"View FAR",
      url:"https://www.acquisition.gov/?q=browsefar",
      img:"src/assets/img/placeholder.jpg"
    },
    {
      title:"SBA Commercial Market Representative",
      detail:"Details for SBA Commercial Market Representative: ",
      link:"View SBA CMR",
      url:"https://www.sba.gov/contracting/resources-small-businesses/commercial-market-representatives",
      img:"src/assets/img/placeholder.jpg"
    },
    {
      title:"Request DUNS Number",
      detail:"Details for Request DUNS Number: ",
      link:"View DUNS Number",
      url:"http://fedgov.dnb.com/webform",
      img:"src/assets/img/placeholder.jpg"
    }
  ];

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageLibraryComponent],
      imports: [HelpModule, RouterTestingModule]

    });
    fixture = TestBed.createComponent(ImageLibraryComponent);
    component = fixture.componentInstance;
    component.data = dataConfig;
    component.name = "contract";
  });

  it('should open detail when clicking on icon', ()=> {
    fixture.detectChanges();
    fixture.whenStable().then(() =>{
      expect(component.detailObj.showDetail).toBe(false);
      fixture.nativeElement.querySelector('#contract-Request-DUNS-Number-icon').click();

      fixture.detectChanges();
      let contractDetail = fixture.debugElement.query(By.css("#detail-text-2"));
      expect(contractDetail.nativeElement.innerHTML).toBe(dataConfig[2].detail);
      expect(component.detailObj.showDetail).toBe(true);
    });
  });

  it('should open detail when clicking on link', ()=> {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.detailObj.showDetail).toBe(false);
      fixture.nativeElement.querySelector('#contract-Request-DUNS-Number-link').click();

      fixture.detectChanges();
      let contractDetail = fixture.debugElement.query(By.css("#detail-text-2"));
      expect(contractDetail.nativeElement.innerHTML).toBe(dataConfig[2].detail);
      expect(component.detailObj.showDetail).toBe(true);
    });
  });

  it('should open detail when clicking on semi-transparent div', ()=> {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.detailObj.showDetail).toBe(false);
      fixture.nativeElement.querySelector('#contract-Request-DUNS-Number-div').click();

      fixture.detectChanges();
      let contractDetail = fixture.debugElement.query(By.css("#detail-text-2"));
      expect(contractDetail.nativeElement.innerHTML).toBe(dataConfig[2].detail);
      expect(component.detailObj.showDetail).toBe(true);
    });
  });

  it('should hide detail when clicking on the same icon while the corresponding detail is open', ()=> {
    component.detailObj.showDetail = true;
    component.detailObj.item = dataConfig[2];
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      let contractDetail = fixture.debugElement.query(By.css("#detail-text-2"));
      expect(contractDetail.nativeElement.innerHTML).toBe(dataConfig[2].detail);
      fixture.nativeElement.querySelector('#contract-Request-DUNS-Number-icon').click();

      fixture.detectChanges();
      expect(component.detailObj.showDetail).toBe(false);
    });
  });

  it('should hide detail when clicking on the close link while the corresponding detail is open', ()=> {
    component.detailObj.showDetail = true;
    component.detailObj.item = dataConfig[2];
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      let contractDetail = fixture.debugElement.query(By.css("#detail-text-2"));
      expect(contractDetail.nativeElement.innerHTML).toBe(dataConfig[2].detail);
      fixture.nativeElement.querySelector('.image-library-close').click();

      fixture.detectChanges();
      expect(component.detailObj.showDetail).toBe(false);
    });
  });
});
