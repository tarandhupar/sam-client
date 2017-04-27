import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';


// Load the implementations that should be tested
import { SamUIKitModule } from 'sam-ui-kit';
import { SamFeedbackComponent } from "./feedback-form.component";
import { FeedbackService } from 'api-kit/feedback/feedback.service';
import { IAMService } from "api-kit/iam/iam.service";
import { ApiService } from "../../../api-kit/iam/api/index";
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";

class ApiServiceStub{
  checkSession($success?,$error?){}
}

class IAMServiceStub {
  iam:ApiService;
}

class FeedbackServiceStub {
  getAllQuestions(){
    return Observable.of({
      "_embedded": {
        "questionList": [
          {
            "questionId": 1,
            "questionDesc": "What do you like or dislike about beta.SAM.gov?",
            "createdDate": "2017-03-22T13:49:34.717-0400",
            "createdBy": "ADMIN",
            "lastModifiedBy": "ADMIN",
            "lastModifiedDate": "2017-03-22T13:49:34.717-0400",
            "_links": {
              "self": {
                "href": "https://csp-api.sam.gov:443/feedback/v1/question?qIds=1"
              }
            },
            "question_options": {
              "type": "rating",
              "options": []
            }
          },
          {
            "questionId": 2,
            "questionDesc": "What do you like or dislike about beta.SAM.gov?",
            "createdDate": "2017-03-22T13:49:34.717-0400",
            "createdBy": "ADMIN",
            "lastModifiedBy": "ADMIN",
            "lastModifiedDate": "2017-03-22T13:49:34.717-0400",
            "_links": {
              "self": {
                "href": "https://csp-api.sam.gov:443/feedback/v1/question?qIds=1"
              }
            },
            "question_options": {
              "type": "singleSelection",
              "options": ["like","dislike"]
            }
          },
          {
            "questionId": 3,
            "questionDesc": "What changes or improvements would you suggest?",
            "createdDate": "2017-03-22T13:49:34.717-0400",
            "createdBy": "ADMIN",
            "lastModifiedBy": "ADMIN",
            "lastModifiedDate": "2017-03-22T13:49:34.717-0400",
            "_links": {
              "self": {
                "href": "https://csp-api.sam.gov:443/feedback/v1/question?qIds=2"
              }
            },
            "question_options": {
              "type": "textarea",
              "options": []
            }
          },
        ]
      },
    });
  }
}

describe('The Sam Feedback component', () => {
  let component:SamFeedbackComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamFeedbackComponent],
      imports: [SamUIKitModule, RouterTestingModule, BrowserModule, FormsModule, ReactiveFormsModule],
      providers: [
        AlertFooterService,
        { provide: ApiService, useClass: ApiServiceStub},
        { provide: IAMService, useClass: IAMServiceStub},
        { provide: FeedbackService ,useClass: FeedbackServiceStub}
      ]
    });

    fixture = TestBed.createComponent(SamFeedbackComponent);
    component = fixture.componentInstance;
  });

  it('should compile sam feedback component', function () {

    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should toggle sam feedback on and off', () => {
    fixture.detectChanges();
    expect(component.showFeedback).toBe(false);
    component.toggleFeedback();
    expect(component.showFeedback).toBe(true);
    component.toggleFeedback();
    expect(component.showFeedback).toBe(false);
  });

  it('should have correct answer when selection made for questions', () => {
    fixture.detectChanges();
    component.resetAll();
    component.toggleFeedback();
    component.onRatingClick(true);
    expect(component.answerData[0].value).toEqual([true]);
    component.onRatingClick(false);
    expect(component.answerData).toEqual([
      {edited:true, value:[false]},
      {edited:false},
      {edited:false}
    ]);
  });

  it('should generate correct feedback object when submit button clicked', () => {
    fixture.detectChanges();
    component.resetAll();
    component.toggleFeedback();
    component.onRatingClick(true);
    expect(component.answerData[0].value).toEqual([true]);
    component.onNextClick();
    component.onRadioBtnChange("like");
    expect(component.generateFeedbackRes()).toEqual({
      userId:"",
      feedbackPath: '',
      feedbackList:[
        {
          questionId: 1,
          userId: "",
          feedback_response: {
            type: "rating",
            selected: [true],
          }
        },
        {
          questionId: 2,
          userId: "",
          feedback_response: {
            type: "singleSelection",
            selected: ["like"],
          }
        }
      ]
    });

  });

  it('should populate the pagination and current page correctly', () => {
    fixture.detectChanges();
    component.toggleFeedback();
    expect(component.getPaginationArray()).toEqual([0,1,2]);
    expect(component.isCurrentPage(0)).toBe(true);
    component.onNextClick();
    expect(component.isCurrentPage(1)).toBe(true);
    component.onPreviousClick();
    expect(component.isCurrentPage(0)).toBe(true);
    expect(component.isLastPage(2)).toBe(true);

  });

  it('should not have previous button on the first page and next button on the last page', () => {
    fixture.detectChanges();
    component.toggleFeedback();
    expect(component.isPrevButtonOn()).toBe(false);
    expect(component.isNextButtonOn()).toBe(true);
    component.onNextClick();
    expect(component.isPrevButtonOn()).toBe(true);
    expect(component.isNextButtonOn()).toBe(true);
    component.onNextClick();
    expect(component.isPrevButtonOn()).toBe(true);
    expect(component.isNextButtonOn()).toBe(false);
  });

  it('should recognize url is in the same page or not', () => {
    fixture.detectChanges();
    expect(component.isUrlInSamePage('/help#reference','/help')).toBe(true);
    expect(component.isUrlInSamePage('/help','/help')).toBe(true);
    expect(component.isUrlInSamePage('/help#reference','/award')).toBe(false);
    expect(component.isUrlInSamePage('/help/section1#reference','/help#subsection1')).toBe(false);
  });

  it('should not submit empty feedback', () => {
    fixture.detectChanges();
    component.resetAll();
    component.onSubmitFeedbackClick();
    expect(component.isFeedbackAnswerEmpty()).toBe(true);
    expect(component.showEmptyFeedbackWarning).toBe(true);
  });

  it('should reset feedback answer', () => {
    fixture.detectChanges();
    component.resetAll();
    component.toggleFeedback();
    component.onRatingClick(true);
    expect(component.answerData[0].edited).toEqual(true);
    expect(component.answerData[0].value).toEqual([true]);
    component.resetCurQAnswer();
    expect(component.answerData[0].edited).toEqual(false);

  });

});
