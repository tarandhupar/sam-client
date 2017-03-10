import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sam-feedback',
  templateUrl:'feedback-form.template.html',
})
export class SamFeedbackComponent {

  questionData = [
    {type:'rating',description:'Was the information helpful?',selections:[]},
    {type:'multiSelection',description:'Which type of search did you use?',selections:['Opportunities','Assistance Listings','FH','Entities']},
    {type:'singleSelection',description:'Did you get what you need',selections:['Yes','No']},
    {type:'text',description:'What do you think about our website?',selections:[]},
    {type:'last', description:'Can we follow up with you in the future?',selections:[]}
  ];

  answerData = [];

  showFeedback: boolean = false;
  curQueIndex: number = 0;
  curQuestion = this.questionData[this.curQueIndex];

  ratingThumbUpClass: string = "fa-thumbs-o-up";
  ratingThumbDownClass: string = "fa-thumbs-o-down";

  multiSelectionModel = {};

  radioBtnValue: string = "";

  emailRadioBtnValue: string = "";
  userEmailModel: string = "";

  textAreaModel: string = "";

  formStarted: boolean = false;
  formSubmitted: boolean = false;

  currentUrl: string = "";
  nextUrl: string = "";

  proceedResult: boolean = false;

  @ViewChild('proceedModal') proceedModal;
  modalConfig = {
    type:'warning',
    title:'Confirm Proceed',
    description:'You have feedback that is not submitted. Do you want to proceed ahead?'
  }
  @ViewChild("feedbackRoot") feedbackRoot;

  private backdropElement: HTMLElement;

  constructor(private router: Router){
    this.createBackdrop();
  }

  ngOnInit(){
    this.router.events.subscribe(
      val => {

        if(this.currentUrl === ""){
          this.currentUrl = val.url;
        }else{
          this.nextUrl = val.url;
          if(!this.isUrlInSamePage(this.currentUrl, this.nextUrl) && this.showUnsubmittedWarning()){
            this.showProceedModal();
          }
        }

      });

    this.setUpAnswerArray();
  }

  toggleFeedback(){
    this.showFeedback = !this.showFeedback;
    if(this.showFeedback){
      this.formStarted = true;
      this.resultInit();
      if(document && document.body){
        document.body.appendChild(this.backdropElement);
        document.body.className += " feedback-open";
      }
      if(window){
        window.setTimeout(() => this.feedbackRoot.nativeElement.focus(), 0);
      }
    }else{
      if(document && document.body){
        document.body.removeChild(this.backdropElement);
        document.body.className = document.body.className.replace(/feedback-open\b/, "");
      }
    }
  }


  onRatingClick(val){
    this.setRatingResult(val);
  }

  onRadioBtnChange(val){
    this.setSingleSelectionResult(val);
  }

  onEmailRadioBtnChange(val){
    this.setLastQueResult(val);
  }

  onTextAreaChange(){
    if(this.textAreaModel !== ""){
      this.setCurQAnswer(this.textAreaModel);
    }else{
      this.resetCurQAnswer();
    }
  }

  onCbxChange(value, checked){
    let cbxEmpty = true;
    Object.keys(this.multiSelectionModel).forEach(key => {
      if(this.multiSelectionModel[key]) cbxEmpty = false;
    });
    cbxEmpty? this.resetCurQAnswer():this.setCurQAnswer(this.multiSelectionModel);
  }

  onPreviousClick(){
    this.curQueIndex--;
    this.curQuestion = this.questionData[this.curQueIndex];
    this.resultInit();
  }

  onNextClick(){
    this.curQueIndex++;
    this.curQuestion = this.questionData[this.curQueIndex];
    this.resultInit();
  }

  onSubmitFeedbackClick(){
    //Get the email of user if Yes is selected on last question
    console.log("last: "+this.answerData[this.answerData.length-1].value);
    if(this.answerData[this.answerData.length-1].value === "Yes"){
      //Get the email address of user
      this.answerData[this.answerData.length-1].value = this.userEmailModel;
    }
    console.log(this.answerData);
    this.formSubmitted = true;
    this.toggleFeedback();
    this.resetAll();
  }

  showProceedModal(){
    this.proceedModal.openModal();
  }

  onProceedModalConfirm() {
    this.proceedResult = true;
    this.proceedModal.closeModal();
  }

  onProceedModalClose(){
    if(!this.proceedResult){
      this.nextUrl = "";
      this.router.navigateByUrl(this.currentUrl);
    }else{
      this.currentUrl = this.nextUrl;
      this.resetAll();
    }
  }

  getPaginationArray(){return Array.from(Array(this.questionData.length).keys());}
  getPageClass(val){return this.isCurrentPage(val)? "feedback-current-page":"";}

  isCurrentQType(type):boolean{return this.curQuestion.type === type;}
  isPrevButtonOn():boolean{return this.curQueIndex !== 0;}
  isNextButtonOn():boolean{return this.curQueIndex !== this.questionData.length-1;}
  isPageEdited(page){return this.answerData[page].edited;}
  isCurrentPage(page){return page === this.curQueIndex;}
  isLastPage(page){return page === this.questionData.length - 1;}

  showUnsubmittedWarning(){
    return this.formStarted && !this.formSubmitted && !this.showFeedback;
  }

  resultInit(){
    if(this.answerData[this.curQueIndex].edited){
      switch(this.questionData[this.curQueIndex].type){
        case 'rating':
          this.setRatingResult(this.answerData[this.curQueIndex].value);
          break;
        case 'multiSelection':
          this.setMultiSelectionResult(this.answerData[this.curQueIndex].value);
          break;
        case 'singleSelection':
          this.setSingleSelectionResult(this.answerData[this.curQueIndex].value);
          break;
        case 'text':
          this.setTextAreaResult(this.answerData[this.curQueIndex].value);
          break;
        case 'last':
          this.setLastQueResult(this.answerData[this.curQueIndex].value);
          break;
        default:
          break;
      }
    } else{
      this.resetQueOptions();
      if(this.questionData[this.curQueIndex].type === 'multiSelection'){
        this.setUpMultiSelectionModel(this.questionData[this.curQueIndex].selections);
      }
    }
  }

  setRatingResult(val){
    if(val){
      this.ratingThumbUpClass = "fa-thumbs-up";
      this.ratingThumbDownClass = "fa-thumbs-o-down";
    }else{
      this.ratingThumbUpClass = "fa-thumbs-o-up";
      this.ratingThumbDownClass = "fa-thumbs-down";
    }
    this.setCurQAnswer(val);
  }

  setMultiSelectionResult(selectedOptions){

    this.multiSelectionModel = selectedOptions;
    this.setCurQAnswer(selectedOptions);
  }

  setSingleSelectionResult(val){
    this.radioBtnValue = val;
    this.setCurQAnswer(val);
  }

  setTextAreaResult(val){
    this.textAreaModel = val;
  }

  setLastQueResult(val){
    this.emailRadioBtnValue = val;
    this.setCurQAnswer(val);
  }

  setCurQAnswer(val){
    this.answerData[this.curQueIndex].edited = true;
    this.answerData[this.curQueIndex].value = val;
  }

  resetCurQAnswer(){
    this.answerData[this.curQueIndex].edited = false;
    this.answerData[this.curQueIndex].value = {};
  }

  setUpAnswerArray(){
    this.answerData = [];
    this.questionData.forEach(()=>this.answerData.push({edited:false}));
  }

  setUpMultiSelectionModel(options){
    options.forEach( e => {
      this.multiSelectionModel[e] = false;
    });

  }

  resetAll(){
    this.setUpAnswerArray();
    this.resetQueOptions();
    this.showFeedback = false;
    this.curQueIndex = 0;
    this.curQuestion = this.questionData[this.curQueIndex];
    this.formStarted = false;
    this.formSubmitted = false;
    this.proceedResult = false;
  }

  resetQueOptions(){
    this.ratingThumbUpClass = "fa-thumbs-o-up";
    this.ratingThumbDownClass = "fa-thumbs-o-down";
    this.radioBtnValue = "";
    this.emailRadioBtnValue = "";
    this.userEmailModel = "";
    this.textAreaModel = "";
    this.multiSelectionModel = {};
  }

  private createBackdrop(){
    this.backdropElement = document.createElement("div");
    this.backdropElement.classList.add("feedback-backdrop");
  }

  /**
    Compare the path before # in url to see if they are in the same page
   */
  isUrlInSamePage(curPath, targetPath){
    return this.getURLPage(curPath) === this.getURLPage(targetPath);
  }

  private getURLPage(urlPath): string{
    let curPathLastIndex = urlPath.indexOf('#');
    let urlPathPage = curPathLastIndex === -1? urlPath: urlPath.substr(0,curPathLastIndex);
    return urlPathPage;
  }
}
