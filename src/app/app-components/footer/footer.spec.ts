import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Load the implementations that should be tested
import {SamUIKitModule} from 'ui-kit';
import {SamFooterComponent} from "./footer.component";

describe('The Sam Footer component', () => {
  let component:SamFooterComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamFooterComponent],
      imports: [SamUIKitModule, RouterTestingModule]
    });

    fixture = TestBed.createComponent(SamFooterComponent);
    component = fixture.componentInstance;
  });

  it('should compile sam footer', function () {
    fixture.detectChanges();
    expect(true).toBe(true);
  });
});
