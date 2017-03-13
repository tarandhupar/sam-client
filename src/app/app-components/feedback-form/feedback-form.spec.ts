import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// Load the implementations that should be tested
import {SamUIKitModule} from 'sam-ui-kit';
import {SamFeedbackComponent} from "./feedback-form.component";

describe('The Sam Feedback component', () => {
  let component:SamFeedbackComponent;
  let fixture:any;
  let questionData = [
    {type:'rating',description:'Was the information helpful?',selections:[]},
    {type:'multiSelection',description:'Which type of search did you use?',selections:['Opportunities','AssistanceListings','FH','Entities']},
    {type:'singleSelection',description:'Did you get what you need',selections:['Yes','No']},
    {type:'text',description:'What do you think about our website?',selections:[]},
    {type:'last', description:'Can we follow up with you in the future?',selections:[]}
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamFeedbackComponent],
      imports: [SamUIKitModule, RouterTestingModule, BrowserModule, FormsModule]
    });

    fixture = TestBed.createComponent(SamFeedbackComponent);
    component = fixture.componentInstance;
    component.questionData = questionData;
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
    component.toggleFeedback();
    component.onRatingClick(true);
    expect(component.answerData[0].value).toBe(true);
    component.onRatingClick(false);
    expect(component.answerData[0].value).toBe(false);
    component.onNextClick();
    component.onNextClick();
    component.onNextClick();
    component.onNextClick();
    component.onEmailRadioBtnChange("No");
    expect(component.answerData).toEqual([
      {edited:true, value:false},
      {edited:false},
      {edited:false},
      {edited:false},
      {edited:true, value:"No"}
    ]);
    component.onSubmitFeedbackClick();
  });

  it('should reset answers when submit button clicked', () => {
    fixture.detectChanges();
    component.toggleFeedback();
    component.onRatingClick(true);
    expect(component.answerData[0].value).toBe(true);
    component.onNextClick();
    component.onNextClick();
    component.onRadioBtnChange("Yes");
    component.onNextClick();
    component.onNextClick();
    component.onEmailRadioBtnChange("No");
    expect(component.answerData).toEqual([
      {edited:true, value:true},
      {edited:false},
      {edited:true, value:"Yes"},
      {edited:false},
      {edited:true, value:"No"}
    ]);
    component.onSubmitFeedbackClick();
    expect(component.answerData).toEqual([
      {edited:false}, {edited:false}, {edited:false}, {edited:false}, {edited:false}
    ]);
  });

  it('should populate the pagination and current page correctly', () => {
    fixture.detectChanges();
    component.toggleFeedback();
    expect(component.getPaginationArray()).toEqual([0,1,2,3,4]);
    expect(component.isCurrentPage(0)).toBe(true);
    component.onNextClick();
    expect(component.isCurrentPage(1)).toBe(true);
    component.onPreviousClick();
    expect(component.isCurrentPage(0)).toBe(true);
    expect(component.isLastPage(4)).toBe(true);

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
    expect(component.isNextButtonOn()).toBe(true);
    component.onNextClick();
    expect(component.isPrevButtonOn()).toBe(true);
    expect(component.isNextButtonOn()).toBe(true);
    component.onNextClick();
    expect(component.isPrevButtonOn()).toBe(true);
    expect(component.isNextButtonOn()).toBe(false);
  });

  it('should populate the stored result when open the feedback on the same page again', () => {
    fixture.detectChanges();
    component.toggleFeedback();
    component.onRatingClick(true);
    expect(component.answerData[0].value).toBe(true);
    component.onNextClick();
    expect(component.isCurrentQType("multiSelection")).toBe(true);
    component.setMultiSelectionResult({Opportunities:true,AssistanceListings:true,FH:false,Entities:false});
    component.onNextClick();
    component.onRadioBtnChange("Yes");
    component.onNextClick();
    component.onNextClick();
    component.onEmailRadioBtnChange("No");
    expect(component.answerData).toEqual([
      {edited:true, value:true},
      {edited:true, value:{Opportunities:true,AssistanceListings:true,FH:false,Entities:false}},
      {edited:true, value:"Yes"},
      {edited:false},
      {edited:true, value:"No"}
    ]);
    expect(component.isPageEdited(0)).toBe(true);
    expect(component.isPageEdited(1)).toBe(true);
    expect(component.isPageEdited(2)).toBe(true);
    expect(component.isPageEdited(3)).toBe(false);
    expect(component.isPageEdited(4)).toBe(true);
    component.toggleFeedback();
    component.toggleFeedback();
    expect(component.answerData).toEqual([
      {edited:true, value:true},
      {edited:true, value:{Opportunities:true,AssistanceListings:true,FH:false,Entities:false}},
      {edited:true, value:"Yes"},
      {edited:false},
      {edited:true, value:"No"}
    ]);
  });

  it('should recognize url is in the same page or not', () => {
    fixture.detectChanges();
    expect(component.isUrlInSamePage('/help#reference','/help')).toBe(true);
    expect(component.isUrlInSamePage('/help','/help')).toBe(true);
    expect(component.isUrlInSamePage('/help#reference','/award')).toBe(false);
    expect(component.isUrlInSamePage('/help/section1#reference','/help#subsection1')).toBe(false);
  })

});
