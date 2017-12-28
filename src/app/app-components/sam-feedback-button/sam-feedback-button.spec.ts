import { TestBed } from '@angular/core/testing';
import { SamFeedbackButtonComponent } from './sam-feedback-button.component';

import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';

let component: any;
let fixture: any;

describe('Sam Feedback Button Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamFeedbackButtonComponent ],
      providers: [FeedbackFormService],
      imports: [
        SamUIKitModule
      ]
    });

    fixture = TestBed.createComponent(SamFeedbackButtonComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should compile same feedback button component', function () {
    expect(true).toBe(true);
  });

  it('should initialize feedback to form service instance', () => {
    expect(component.feedback).toEqual(component.formService.componentInstance);
  });
});
