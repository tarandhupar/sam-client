import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// Load the implementations that should be tested
import {SamUIKitModule} from 'samUIKit';
import {SamFeedbackComponent} from "./feedback-form.component";

describe('The Sam Footer component', () => {
  let component:SamFeedbackComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamFeedbackComponent],
      imports: [SamUIKitModule, RouterTestingModule, BrowserModule, FormsModule]
    });

    fixture = TestBed.createComponent(SamFeedbackComponent);
    component = fixture.componentInstance;
  });

  it('should compile sam feedback component', function () {
    fixture.detectChanges();
    expect(true).toBe(true);
  });
});
