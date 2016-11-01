import {TestBed} from '@angular/core/testing';

// Load the implementations that should be tested
import {SamAlertListComponent} from './alert-list.component';

describe('The Sam List Alert component', () => {
  let component:SamAlertListComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamAlertListComponent],
    });

    fixture = TestBed.createComponent(SamAlertListComponent);
    component = fixture.componentInstance;
  });

  it('should show 0 alerts if zero alerts are visible', () => {
    fixture.detectChanges();
  });

  it('should show 5 alerts if 5 alerts are returned', () => {

  });

});
