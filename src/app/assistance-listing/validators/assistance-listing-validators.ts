import {AbstractControl, FormControl, AsyncValidatorFn, ValidatorFn, Validators} from "@angular/forms";
import * as _ from 'lodash';
import { ValidationErrors } from "../../app-utils/types";
import * as moment from 'moment/moment';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';

export class falCustomValidatorsComponent {

  constructor(){}

  static autoCompleteRequired(control){
    let flag = null;

    if((control.value && control.value.length == 0) || control.value == '') {
      flag = {
        requiredField : {
          message: 'This field is required'
        }
      };
    }

    return flag;
  }
  static checkboxRequired(control) {
    let flag = null;

    if (control.value && control.value.length == 0) {
      flag = {
        requiredField: {
          message: 'This field is required'
        }
      };
    }

    return flag;
  }

  static isProgramNumberInTheRange(rangeLow, rangeHigh){
    let programRangeError = {message: "CFDA number not in the range: "+rangeLow+" - "+rangeHigh};
    return (control) => {
      let flag = falCustomValidatorsComponent.threeDigitNumberCheck(control);
      if(flag == null) {
        if(control.value < rangeLow || control.value > rangeHigh){
          flag = {isProgramInTheRange: programRangeError};
        }
      }
      else{
        flag.threeDigitNumberCheck = {message:"Please enter a three digit number."};
      }
      return flag;
    }
  }

  static isAgencyPickerValueDiff(oldValue) {
    return (control) => {
      return (control.value && control.value.value == oldValue) ? { error: true } : null;
    }
  }

  static isProgramNumberUnique(programService, cfdaCode, id, cookie, OrgId): AsyncValidatorFn {
    return (control) => {

      if(control.value == null || control.value == '') {
        return Observable.empty<Response>();
      }

      let programNum = cfdaCode + '.' + control.value;
      return programService.isProgramNumberUnique(programNum, id, cookie, OrgId).map(res => {
        if (!res['content']['isProgramNumberUnique']) {
          return { 'programNumberUnique': { 'message': 'CFDA Number already exists. Please enter a valid Number.' } };
        } else {
          return null;
        }
      })
      .delay(1000);
    }
  }

  static threeDigitNumberCheck(control){
    let flag = null;
    if (!control.value && control.value.length == 0) {
      flag = {
        required: true
      };
    }else if(control.value.length != 3 || isNaN(control.value)){
      flag = {threeDigitNumberCheck: true};
    }
    return flag;
  }

  static numberCheck(control){
    let flag = null;
    let regex = new RegExp("^\\d{0,9}$");
    if (!control.value && control.value.length == 0) {
      flag = {
        required: true
      };
    }else if(!regex.test(control.value)){
      flag = {numberCheck: true};
    }
    return flag;
  }

  static atLeastOneEntryCheck(control){
    let flag = null;
    if(control.value.length == 0){
      flag = {atLeastOneEntryCheck: true};
    }
    return flag;
  }

  static checkForDifferentTitle(title){
    let titleError = {message:"Please select a different title"};
    return (control) => {
      let flag = falCustomValidatorsComponent.atLeastOneEntryCheck(control);
      if(flag == null) {
        if (control.value.toUpperCase().trim() === title.toUpperCase().trim()) {
          flag = {checkForDifferentValue: titleError};
        }
      } else{
        flag.atLeastOneEntryCheck = {message:"Title cannot be empty"};
      }

      return flag;
    }
  }

  static radioButtonRequired(control: AbstractControl): ValidationErrors | null{
    let error: ValidationErrors = {
     requiredField : {
     message: 'This field is required'
     }
    };

    if (!control.value) {
      return error;
    }

    return null;
  }

  static selectRequired(control: AbstractControl): ValidationErrors | null {
    let error: ValidationErrors = {
      requiredField : {
        message: 'This field is required'
      }
    };

    if (control.value === 'na') {
      return error;
    }

    return null;
  };

  static checkforThe(control) {
    let flag = null;
    let val = control.value.toLowerCase();
    if(val.indexOf("the ") >= 0 ||  val.indexOf(" the ") >= 0 || val.indexOf(" the") >= 0) {
      flag = {"titleTheError": true};
    }
    return flag;
  }

  static checkforProgram(control) {
    let flag = null;
    let val = control.value.toLowerCase();
    if(val.indexOf("program ") >= 0 ||  val.indexOf(" program ") >= 0 || val.indexOf(" program") >= 0) {
      flag = {"titleProgError": true};
    }
    return flag;
  }

  static checkURLPattern(control){
    let flag = null;
    let pattern = /^(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
    if(control.value && !pattern.test(control.value))
      flag = {"urlError": {message: "Please enter a valid url. [protocol]://hostname.domain. Protocol can be ftp, http, or https. Spaces are not allowed."}};
      //flag = {"urlError": true};

    return flag;
  }

  static checkEmailPattern(control){
    let flag = null;
    //let pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    let pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(control.value && !pattern.test(control.value))
      flag = {"emailError": {message: "Please enter a valid Internet email address. Format: username@host.domain."}};
      //flag = {"emailError": true};

    return flag;
  }

  static nDigitsValidator = (n: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors => {
      let errors: ValidationErrors = {};
      Object.assign(errors, Validators.pattern('[0-9]*')(control), Validators.minLength(n)(control), Validators.maxLength(n)(control));

      // todo: once label wrapper is updated to use custom messages, return normal error key with custom message
      if (!_.isEmpty(errors)) {
        return {
          error: {
            message: 'Provide a valid number using numerical values ' + Array(n+1).join('0') + '-' + Array(n+1).join('9') + '.'
          }
        }
      } else {
        return null;
      }
    };
  };

  static checkAcctIdenficationCode(control){
    if(control.value && control.value.length<15){
      return {
        acctIdenficationCode:{
          message: "Provide a valid 11 digit account code using only numerical values."
        }
      }
    }
    return null;
  }
  static arrayRequired(control){
    if(control.value && control.value.length == 0 ) {
      return {
        required : true
      };
    }
    return null;
  }

  static dateRangeRequired(c:AbstractControl){

    if(c.dirty && (!c.value || !c.value.startDate)){
      return {
        dateRangeError: {
          message: "This field is required"
        }
      };
    }
    return null;
  }

  static dateRangeValidation(c:AbstractControl){
    if(c.value && c.value.startDate && c.value.endDate){
      let startDateM = moment(c.value.startDate);
      let endDateM = moment(c.value.endDate);

      if(startDateM.get('year') > 1000 && endDateM.get('year') > 1000 && endDateM.diff(startDateM) < 0){
        return {
          dateRangeError: {
            message: "Invalid date range"
          }
        }
      }

      if((!startDateM.isValid() || c.value.startDate == "Invalid date") && (!endDateM.isValid() || c.value.endDate == "Invalid date")) {
        return {
          dateRangeError: {
            message: "Invalid from and to date."
          }
        }
      }
    }

    if (c.value && c.value.startDate){
      let startDateM = moment(c.value.startDate);
      if(!startDateM.isValid() || c.value.startDate == "Invalid date"){
        return {
          dateRangeError: {
            message: "Invalid from date"
          }
        }
      }
    }
    else if(!c.value || !c.value.startDate) {
      if (c.value && c.value.endDate){
        let endDateM = moment(c.value.endDate);
        if(!endDateM.isValid() || c.value.endDate == "Invalid date"){
          return {
            dateRangeError: {
              message: "From date is required and Invalid to date"
            }
          }
        }
      }

      return {
        dateRangeError: {
          message: "From date is required"
        }
      };
    }

    if (c.value && c.value.endDate){
      let endDateM = moment(c.value.endDate);
      if(!endDateM.isValid() || c.value.endDate == "Invalid date"){
        return {
          dateRangeError: {
            message: "Invalid to date"
          }
        }
      }
    }
    return null;
  }
}

