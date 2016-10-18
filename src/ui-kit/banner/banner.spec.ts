import {TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamBannerComponent} from './banner.component';

describe('The Sam Banner component', () => {
  let component:SamBannerComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamBannerComponent],
    });

    fixture = TestBed.createComponent(SamBannerComponent);
    component = fixture.componentInstance;

  });

  it('should display banner', function () {
    fixture.detectChanges();
    expect(component.showBanner).toBe(true);

  });

  it('should output close banner event after clicking the close button', () => {
    let closeBannerBtn:any;
    component.onClose.subscribe(show => {
      expect(show).toBe(false);
      expect(component.showBanner).toBe(false);
    });
    fixture.detectChanges();
    expect(component.showBanner).toBe(true);
    closeBannerBtn = fixture.debugElement.query(By.css('.fa-times-circle'));
    closeBannerBtn.triggerEventHandler('click', null);

  });


});
