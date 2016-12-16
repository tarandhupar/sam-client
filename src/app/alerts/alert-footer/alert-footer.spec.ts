import {TestBed,inject} from '@angular/core/testing';
import {Observable} from 'rxjs';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import {AlertFooterComponent} from './alert-footer.component';
import {SamUIKitModule} from 'ui-kit';
import {AlertFooterService} from "./alert-footer.service";


describe('The AlertFooter component', () => {
  let component:AlertFooterComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertFooterComponent],
      imports: [SamUIKitModule],
      providers: [AlertFooterService]
    });

    fixture = TestBed.createComponent(AlertFooterComponent);
    component = fixture.componentInstance;
  });


  it('should show 1 alert', inject([AlertFooterService],(alertFooterService) => {
    fixture.detectChanges();
    alertFooterService.registerFooterAlert({
      title:"test",
      description:"test",
      type:'success',
      timer:0
    });
    component.refreshAlerts();
    fixture.detectChanges();
    //console.log(fixture.nativeElement.querySelector("samalert"));
    expect(fixture.nativeElement.querySelectorAll("samalert").length).toBe(1);
  }));
});
