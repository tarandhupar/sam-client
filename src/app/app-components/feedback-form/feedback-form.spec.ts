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
  createFeedback(resObj){
    return Observable.of({});
  }

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
            },
          },
          {
            "questionId": 4,
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
              "type": "multiSelection",
              "options": ["A","B","C"]
            },
          },
        ]
      },
    });
  }
}

fdescribe('The Sam Feedback component', () => {
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
    expect(component.isFeedbackAnswerEmpty()).toBe(true);
    component.onRatingClick(true, 0);
    expect(component.answerData[0].value).toEqual([true]);
    component.onRatingClick(false, 0);
    expect(component.answerData).toEqual([{edited:true, value:[false]}, {edited:false}, {edited:false}, {edited:false},]);
    expect(component.isFeedbackAnswerEmpty()).toBe(false);
    expect(component.generateFeedbackRes()).toEqual({
      userId: '',
      feedbackPath: '',
      feedbackList: [ { questionId: 1, userId: '', feedback_response: { type: 'rating', selected: [ false ] } } ]
    });
  });

  it('should have correct result object ready for answers of questions', () => {
    fixture.detectChanges();
    component.resetAll();
    component.toggleFeedback();
    expect(component.isFeedbackAnswerEmpty()).toBe(true);
    component.onRatingClick(true, 0);
    component.onRadioBtnChange('like',1);
    component.resultInit(3);
    component.multiSelectionModel = {'A':true,'B':false,'C':false};
    component.onCbxChange('A',true,3);
    expect(component.isFeedbackAnswerEmpty()).toBe(false);
    expect(component.generateFeedbackRes()).toEqual({
      userId: '',
      feedbackPath: '',
      feedbackList: [
        { questionId: 1, userId: '', feedback_response: { type: 'rating', selected: [ true ] } },
        { questionId: 2, userId: '', feedback_response: { type: 'singleSelection', selected: [ 'like' ] } },
        { questionId: 4, userId: '', feedback_response: { type: 'multiSelection', selected: [ 'A' ] } },
      ]
    });
    component.toggleFeedback();
    component.toggleFeedback();
    component.resultInit(1);
    component.resultInit(3);
    expect(component.multiSelectionModel).toEqual({'A':true, B: false, C: false });
    component.onSubmitFeedbackClick();
  });

  it("should be able to reset answers", () => {
    fixture.detectChanges();
    component.resetAll();
    component.toggleFeedback();
    expect(component.isFeedbackAnswerEmpty()).toBe(true);
    component.textAreaModel = "Test Text Area";
    component.onTextAreaChange(2);
    component.resultInit(2);
    component.resetQAnswer(2);
    expect(component.generateFeedbackRes()).toEqual({userId: '', feedbackPath: '', feedbackList: []});
  });


});
