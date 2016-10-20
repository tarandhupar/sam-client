import {TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamAngularModule} from '../../sam-angular';
import {SamFooterComponent} from "./sam-footer.component";

describe('The Sam Footer component', () => {
  let component:SamFooterComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SamFooterComponent],
      imports: [SamAngularModule]
    });

    fixture = TestBed.createComponent(SamFooterComponent);
    component = fixture.componentInstance;

  });

  it('should compile sam footer', function () {
    fixture.detectChanges();
    expect(true).toBe(true);

  });




});
