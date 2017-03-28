import { Component, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FeedbackService, feedbackResItemType } from 'api-kit/feedback/feedback.service';
import { IAMService } from "api-kit/iam/iam.service";
import { Observable, Subscription } from 'rxjs/Rx';
import { Validators as $Validators } from '../../authentication/shared/validators';
import { FormControl, Validators } from '@angular/forms';


export let navigateAwayObj = {
  discardFeedbackRes: false,
  formStarted: false,
  formSubmitted: false,
};

@Component({
  selector: 'sam-feedback',
  templateUrl:'feedback-form.template.html',
})
export class SamFeedbackComponent {

  questionData = [];

  answerData = [];

  showFeedback: boolean = false;
  curQueIndex: number = 0;
  curQuestion = this.questionData[this.curQueIndex];

  ratingThumbUpClass: string = "fa-thumbs-o-up";
  ratingThumbDownClass: string = "fa-thumbs-o-down";
  multiSelectionModel = {};
  radioBtnValue: string = "";
  emailRadioBtnValue = "";
  userEmailModel: string = "";
  email: FormControl;
  textAreaModel: string = "";
  emailModelEdited: boolean = false;

  currentUrl: string = "";
  nextUrl: string = "";

  user = null;
  isSignedIn = false;

  timer:Subscription;
  curSec = 5;
  showThanksNote = false;
  showEmptyFeedbackWarning = false;

  @ViewChild('proceedModal') proceedModal;
  modalConfig = {
    type:'warning',
    title:'Confirm Proceed',
    description:'You have feedback that is not submitted. Do you want to proceed ahead?'
  };

  @ViewChild("feedbackRoot") feedbackRoot;

  private backdropElement: HTMLElement;

  constructor(private router: Router,
              private feedbackService: FeedbackService,
              private iamService: IAMService,
              private zone: NgZone){
    this.createBackdrop();
  }

  canDeactivate(component: SamFeedbackComponent, route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if(!navigateAwayObj.formSubmitted && navigateAwayObj.formStarted){
      return navigateAwayObj.discardFeedbackRes;
    }

    return true;
  }

  ngOnInit(){
    this.setUpFeedbackQuestions();
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
  }

  toggleFeedback(){
    this.showFeedback = !this.showFeedback;
    if(this.showFeedback){
      navigateAwayObj.formStarted = true;
      this.resultInit();
      if(document && document.body){
        document.body.appendChild(this.backdropElement);
        document.body.className += " feedback-open";
      }
      if(window){
        window.setTimeout(() => this.feedbackRoot.nativeElement.focus(), 0);
      }
    }else{
      if(navigateAwayObj.formSubmitted){
        this.timer.unsubscribe();
        this.resetAll();
      }
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
    this.setRadioEmailResult(val);
  }

  onEmailTextChange(){
    if(!this.emailModelEdited) this.emailModelEdited = true;
    this.setCurQAnswer({selectedValue:'Yes',userEmail:this.userEmailModel});
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
    // Check whether the feedback result is empty
    if(this.isFeedbackAnswerEmpty()){
      this.showEmptyFeedbackWarning = true;
    }else{
      this.emailModelEdited = true;
      if((this.isEmailBtnChecked('Yes') && !this.email.errors) || this.isEmailBtnChecked('No')){
        // Submit the feedback results
        let res = this.generateFeedbackRes();

        this.feedbackService.createFeedback(res);
        navigateAwayObj.formSubmitted = true;
        this.showThanksNote = true;
        this.startCountDown();
      }
    }

  }

  generateFeedbackRes():any{
    let res = {
      userId : this.isEmailBtnChecked('No')? "":this.userEmailModel,
      feedbackPath: this.currentUrl,
      feedbackList: []
    };
    this.answerData.forEach((answerItem,index) => {
      if(answerItem.edited){
        let feedbackResItem:feedbackResItemType = {
          questionId: this.questionData[index].id,
          userId: this.isEmailBtnChecked('No')? "":this.userEmailModel,
          feedback_response: {
            type: this.questionData[index].type,
            selected: this.questionData[index].type === "radio-text"? [answerItem.value[0].userEmail]: answerItem.value,
          },
        };
        res.feedbackList.push(feedbackResItem);
      }
    });
    return res;
  }

  OnOMBlinkClick(){
    this.toggleFeedback();
    if(!this.currentUrl.startsWith("/help/policies")){
      this.router.navigateByUrl("/help/policies#OMB");
    }
  }

  showProceedModal(){
    this.proceedModal.openModal();
  }

  onProceedModalConfirm() {
    navigateAwayObj.discardFeedbackRes = true;
    this.proceedModal.closeModal();
  }

  onProceedModalClose(){
    if(!navigateAwayObj.discardFeedbackRes){
      this.nextUrl = "";
    }else{
      this.currentUrl = this.nextUrl;
      this.router.navigateByUrl(this.currentUrl);
      this.resetAll();
    }
  }

  checkSignInUser() {
    //Get the sign in info
    this.isSignedIn = false;
    this.zone.runOutsideAngular(() => {
      this.iamService.iam.checkSession((user) => {
        this.zone.run(() => {
          this.isSignedIn = true;
          this.user = user;
        });
      });
    });
  }

  getPaginationArray(){return Array.from(Array(this.questionData.length).keys());}
  getPageClass(val){return this.isCurrentPage(val)? "feedback-current-page":"";}

  isCurrentQType(type):boolean{return this.curQuestion.type === type;}
  isPrevButtonOn():boolean{return this.curQueIndex !== 0;}
  isNextButtonOn():boolean{return this.curQueIndex !== this.questionData.length-1;}
  isPageEdited(page){return this.answerData[page].edited;}
  isCurrentPage(page){return page === this.curQueIndex;}
  isLastPage(page){return page === this.questionData.length - 1;}
  isEmailBtnChecked(val){return this.emailRadioBtnValue === val;}

  showUnsubmittedWarning(){

    return navigateAwayObj.formStarted && !navigateAwayObj.formSubmitted && !this.showFeedback;
  }

  resultInit(){
    if(this.answerData[this.curQueIndex].edited){
      switch(this.questionData[this.curQueIndex].type){
        case 'rating':
          this.setRatingResult(this.answerData[this.curQueIndex].value[0]);
          break;
        case 'multiSelection':
          this.setMultiSelectionResult(this.answerData[this.curQueIndex].value);
          break;
        case 'singleSelection':
          this.setSingleSelectionResult(this.answerData[this.curQueIndex].value[0]);
          break;
        case 'textarea':
          this.setTextAreaResult(this.answerData[this.curQueIndex].value);
          break;
        case 'radio-text':
          this.setRadioEmailResult(this.answerData[this.curQueIndex].value[0].selectedValue);
          break;
        default:
          break;
      }
    } else{
      this.resetQueOptions();
      if(this.questionData[this.curQueIndex].type === 'multiSelection'){
        this.setUpMultiSelectionModel(this.questionData[this.curQueIndex].selections);
      }if(this.questionData[this.curQueIndex].type === 'radio-text'){
        this.checkSignInUser();
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

  setRadioEmailResult(val) {
    this.emailRadioBtnValue = val;
    if (this.emailRadioBtnValue === "Yes") {
      if(this.isSignedIn){
        this.userEmailModel = this.user.email;
      }
      this.setCurQAnswer({selectedValue:val,userEmail:this.userEmailModel});
      if(!this.emailModelEdited && this.userEmailModel.length > 0) this.emailModelEdited = true;
    }
    if (this.emailRadioBtnValue === "No") {
      this.emailModelEdited = false;
      this.setCurQAnswer({selectedValue:val});
    }
  }

  setCurQAnswer(val){
    this.answerData[this.curQueIndex].edited = true;
    this.answerData[this.curQueIndex].value = Array.isArray(val)? val:[val];
  }

  resetCurQAnswer(){
    this.answerData[this.curQueIndex].edited = false;
    this.answerData[this.curQueIndex].value = [];
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

  setUpFeedbackQuestions(){
    this.feedbackService.getAllQuestions().subscribe(
      res => {
        this.questionData = [];
        res._embedded.questionList.forEach( q => {
          let questionItem = {
            type : q.question_options.type,
            description : q.questionDesc,
            selections : q.question_options.options,
            id : q.questionId
          };
          this.questionData.push(questionItem);
        });
        this.resetAll();
      }
    );
  }

  resetAll(){
    this.setUpAnswerArray();
    this.resetQueOptions();
    this.resetNavigateObj();
    this.showThanksNote = false;
    this.showEmptyFeedbackWarning = false;
    this.curSec = 5;
    this.showFeedback = false;
    this.curQueIndex = 0;
    this.curQuestion = this.questionData[this.curQueIndex];

  }

  resetNavigateObj(){
    navigateAwayObj.formStarted = false;
    navigateAwayObj.formSubmitted = false;
    navigateAwayObj.discardFeedbackRes = false;
  }

  resetQueOptions(){
    this.ratingThumbUpClass = "fa-thumbs-o-up";
    this.ratingThumbDownClass = "fa-thumbs-o-down";
    this.radioBtnValue = "";
    this.emailRadioBtnValue = "";
    this.userEmailModel = "";
    this.emailModelEdited = false;
    this.email = new FormControl('', [Validators.required, $Validators.email]);
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

  isFeedbackAnswerEmpty(): boolean{
    let isEmpty = true;
    this.answerData.forEach( answerItem => {
      if(answerItem.edited) isEmpty = false;
    });
    return isEmpty;
  }

  startCountDown(){
    this.timer = Observable.interval(1000).subscribe( () => {
      this.curSec -- ;
      if(this.curSec === 0) this.stopCountDown();
    });
  }

  stopCountDown(){
    this.timer.unsubscribe();
    this.toggleFeedback();
    this.resetAll();
  }
}
