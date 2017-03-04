import { Component, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';


@Component({
  selector: 'sam-feedback',
  templateUrl:'feedback-form.template.html',
})
export class SamFeedbackComponent {

  questionData = [
    {type:'rating',description:'Was the information helpful?'},
    {type:'multiSelection',description:'Which type of search did you use?',selections:['Opportunities','Assistance Listings','FH','Entities']},
    {type:'singleSelection',description:'Did you get what you need',selections:['Yes','No']},
    {type:'text',description:'What do you think about our website?'},
    {type:'last', description:'Can we follow up with you in the future?'}
  ];

  answerData = [];

  private curQuestionType: string = "Rating";
  private showFeedback: boolean = false;
  private totalQue: number = 5;
  private curQueIndex: number = 0;
  private curQuestion = this.questionData[this.curQueIndex];

  ratingThumbUpClass: string = "fa-thumbs-o-up";
  ratingThumbDownClass: string = "fa-thumbs-o-down";

  radioBtnValue: string = "";

  emailRadioBtnValue: string = "";

  textAreaModel: string = "";

  @ViewChild("feedbackRoot") feedbackRoot;

  ngOnInit(){
    this.questionData.forEach(()=>this.answerData.push({edited:false}));
  }

  setCurQAnswer(val){
    this.answerData[this.curQueIndex].edited = true;
    this.answerData[this.curQueIndex].value = val;
  }

  resetCurQAnswer(){
    this.answerData[this.curQueIndex].edited = false;
    this.answerData[this.curQueIndex].value = {};
  }

  toggleFeedback(){
    this.showFeedback = !this.showFeedback;
    if(this.showFeedback){
      window.setTimeout(() => this.feedbackRoot.nativeElement.focus(), 0);
    }
  }

  isCurrentQType(type):boolean{
    return this.curQuestion.type === type;
  }

  isPrevButtonOn():boolean{
    return this.curQueIndex !== 0;
  }

  isNextButtonOn():boolean{
    return this.curQueIndex !== this.questionData.length-1;
  }

  onRatingClick(val){
    if(val){
      this.ratingThumbUpClass = "fa-thumbs-up";
      this.ratingThumbDownClass = "fa-thumbs-o-down";
    }else{
      this.ratingThumbUpClass = "fa-thumbs-o-up";
      this.ratingThumbDownClass = "fa-thumbs-down";
    }
    this.setCurQAnswer(val);
  }

  onRadioBtnChange(val){
    this.radioBtnValue = val;
    this.setCurQAnswer(val);
  }

  onEmailRadioBtnChange(val){
    this.emailRadioBtnValue = val;
    this.setCurQAnswer(val);
  }

  onPreviousClick(){
    this.curQueIndex--;
    this.curQuestion = this.questionData[this.curQueIndex];
  }

  onNextClick(){
    this.curQueIndex++;
    this.curQuestion = this.questionData[this.curQueIndex];
  }

  onTextAreaChange(){
    if(this.textAreaModel !== ""){
      this.setCurQAnswer(this.textAreaModel);
    }else{
      this.resetCurQAnswer();
    }
  }

  onCbxChange(value, checked){
    let originAnswer;
    !!this.answerData[this.curQueIndex].value? originAnswer = this.answerData[this.curQueIndex].value: originAnswer = [];
    if(checked){
      originAnswer.push(value);
      this.setCurQAnswer(originAnswer);
    }else{
      let index = originAnswer.indexOf(value);
      originAnswer.splice(index,1);
      originAnswer.length === 0? this.resetCurQAnswer():this.setCurQAnswer(originAnswer);
    }
  }

  getPaginationArray(){
    return Array.from(Array(this.questionData.length).keys());
  }

  getPageClass(val){
    return this.isCurrentPage(val)? "feedback-current-page":"";
  }

  isPageEdited(page){
    return this.answerData[page].edited;
  }

  isCurrentPage(page){
    return page === this.curQueIndex;
  }
}
