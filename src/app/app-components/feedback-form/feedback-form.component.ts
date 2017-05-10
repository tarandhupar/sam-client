import { Component, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FeedbackService, feedbackResItemType } from 'api-kit/feedback/feedback.service';
import { IAMService } from "api-kit/iam/iam.service";
import { Observable, Subscription } from 'rxjs/Rx';
import { Validators as $Validators } from '../../authentication/shared/validators';
import { FormControl, Validators } from '@angular/forms';
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";


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
  curSec = 3;
  showThanksNote = false;
  showEmailError = false;

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
              private zone: NgZone,
              private alertFooterService: AlertFooterService){
    this.createBackdrop();
  }

  private routerSubscribe;
  private internalId;

  canDeactivate(component: SamFeedbackComponent, route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if(!navigateAwayObj.formSubmitted && navigateAwayObj.formStarted){
      return navigateAwayObj.discardFeedbackRes;
    }

    return true;
  }

  ngOnInit(){
    this.setUpFeedbackQuestions();
    this.routerSubscribe = this.router.events.subscribe(
      val => {
        if(this.currentUrl === ""){
          this.currentUrl = val.url;
        }else{
          this.nextUrl = val.url;
          if(!this.isUrlInSamePage(this.currentUrl, this.nextUrl) && this.showunsubmittedWarning()){
            this.showProceedModal();
          }else{
            this.currentUrl = this.nextUrl;
          }
        }
      });
  }

  ngOnDestroy(){
    this.routerSubscribe.unsubscribe();
  }

  toggleFeedback(){
    if(this.questionData.length === 0){
      return;
    }

    this.showFeedback = !this.showFeedback;
    if(this.showFeedback){
      navigateAwayObj.formStarted = true;
      this.resultInit(0);
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

  onRatingClick(val, index){
    this.setRatingResult(val, index);
  }

  onRadioBtnChange(val, index){
    this.setSingleSelectionResult(val, index);
  }

  onEmailRadioBtnChange(val, index){
    this.setRadioEmailResult(val, index);
  }

  onEmailTextChange(index){
    if(!this.emailModelEdited) this.emailModelEdited = true;
    this.setQAnswer({selectedValue:'Yes',userEmail:this.userEmailModel},index);
  }

  onTextAreaChange(index){
    if(this.textAreaModel !== ""){
      this.setQAnswer(this.textAreaModel, index);
    }else{
      this.resetQAnswer(index);
    }
  }

  onCbxChange(value, checked, index){
    let cbxEmpty = true;
    Object.keys(this.multiSelectionModel).forEach(key => {
      if(this.multiSelectionModel[key]) cbxEmpty = false;
    });
    cbxEmpty? this.resetQAnswer(index):this.setQAnswer(this.multiSelectionModel, index);
  }


  onExpandChange(subAccordion, index){
    if(subAccordion.isExpanded){
      this.resultInit(index);
    }
  }

  onSubmitFeedbackClick(){

    if(!this.isFeedbackAnswerEmpty()){
      this.emailModelEdited = true;

      if((this.isEmailBtnChecked('Yes') && this.email.errors)){
        this.showEmailError = true;
      }else if((this.isEmailBtnChecked('Yes') && !this.email.errors) || this.isEmailBtnChecked('No') || this.emailRadioBtnValue === ''){
        // Submit the feedback results
        let res = this.generateFeedbackRes();
        this.feedbackService.createFeedback(res).subscribe(data => {});
      }
    }

    navigateAwayObj.formSubmitted = true;
    this.showThanksNote = true;
    this.startCountDown();

  }

  generateFeedbackRes():any{
    let res = {
      userId : this.isEmailBtnChecked('No')? "":this.userEmailModel,
      feedbackPath: this.currentUrl,
      feedbackList: []
    };
    this.answerData.forEach((answerItem,index) => {
      if(answerItem.edited){
        let val = answerItem.value;
        if(this.questionData[index].type === 'multiSelection'){
          let multiSelectionVal = [];
          Object.keys(answerItem.value[0]).forEach(key => {if(answerItem.value[0][key]) multiSelectionVal.push(key);});
          val = multiSelectionVal;
        }
        let feedbackResItem:feedbackResItemType = {
          questionId: this.questionData[index].id,
          userId: this.isEmailBtnChecked('No')? "":this.userEmailModel,
          feedback_response: {
            type: this.questionData[index].type,
            selected: this.questionData[index].type === "radio-text"? [val[0].userEmail]: val,
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
    this.iamService.iam.checkSession((user) => {
      this.zone.run(() => {
        this.isSignedIn = true;
        this.user = user;
      });
    });
  }

  isEmailBtnChecked(val){return this.emailRadioBtnValue === val;}

  showunsubmittedWarning(){
    return navigateAwayObj.formStarted && !navigateAwayObj.formSubmitted && !this.showFeedback;
  }

  setRatingResult(val, index){
    if(val){
      this.ratingThumbUpClass = "fa-thumbs-up";
      this.ratingThumbDownClass = "fa-thumbs-o-down";
    }else{
      this.ratingThumbUpClass = "fa-thumbs-o-up";
      this.ratingThumbDownClass = "fa-thumbs-down";
    }
    this.setQAnswer(val, index);
  }

  setMultiSelectionResult(selectedOptions, index){
    this.multiSelectionModel = selectedOptions;
    this.setQAnswer(selectedOptions, index);
  }

  setSingleSelectionResult(val, index){
    this.radioBtnValue = val;
    this.setQAnswer(val, index);
  }

  setTextAreaResult(val){
    this.textAreaModel = val;
  }

  setRadioEmailResult(val, index) {
    this.emailRadioBtnValue = val;
    if (this.emailRadioBtnValue === "Yes") {
      if(this.isSignedIn){
        this.userEmailModel = this.user.email;
        this.email.setValue(this.user.email);
      }
      this.setQAnswer({selectedValue:val,userEmail:this.email.value}, index);
      if(!this.emailModelEdited && this.userEmailModel.length > 0) this.emailModelEdited = true;
    }
    if (this.emailRadioBtnValue === "No") {
      this.showEmailError = false;
      this.emailModelEdited = false;
      this.setQAnswer({selectedValue:val,userEmail:""}, index);
    }
  }

  setQAnswer(val, index){
    this.answerData[index].edited = true;
    this.answerData[index].value = Array.isArray(val)? val:[val];
  }

  resetQAnswer(index){
    this.answerData[index].edited = false;
    this.answerData[index].value = [];
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
      },
      error => {
        this.showFooter();
      }
    );

  }

  showFooter() {
    this.alertFooterService.registerFooterAlert({
      title:"The feedback service encountered an error.",
      description:"",
      type:'error',
      timer:0
    });
  }

  resetAll(){
    this.setUpAnswerArray();
    this.resetQueOptions();
    this.resetNavigateObj();
    this.showThanksNote = false;
    this.showEmailError = false;
    this.curSec = 3;
    this.showFeedback = false;
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

  checkQType(typeStr,q):boolean{return q.type === typeStr;}

  resultInit(index){
    if(this.answerData[index].edited){
      switch(this.questionData[index].type){
        case 'rating':
          this.setRatingResult(this.answerData[index].value[0], index);
          break;
        case 'multiSelection':
          this.setMultiSelectionResult(this.answerData[index].value[0], index);
          break;
        case 'singleSelection':
          this.setSingleSelectionResult(this.answerData[index].value[0], index);
          break;
        case 'textarea':
          this.setTextAreaResult(this.answerData[index].value[0]);
          break;
        case 'radio-text':
          this.emailRadioBtnValue = this.answerData[index].value[0].selectedValue;
          this.userEmailModel = this.emailRadioBtnValue === "Yes"? this.answerData[index].value[0].userEmail:"";
          break;
        default:
          break;
      }
    } else{
      this.resetQueOptions();
      if(this.questionData[index].type === 'multiSelection'){
        this.setUpMultiSelectionModel(this.questionData[index].selections);
      }if(this.questionData[index].type === 'radio-text'){
        this.checkSignInUser();
      }
    }
  }

}



