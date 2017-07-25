import {AbstractControl, FormControl} from "@angular/forms";
import { ValidationErrors } from "../../app-utils/types";

export class falCustomValidatorsComponent {

  constructor(){}

  static autoCompleteRequired(control){

    let flag = null;
    if(control.value && control.value.length == 0 ) {
      flag = {
        required : true
      };
    }
    else if(control.value == '') {

      flag = {
        required : true
      };
    }

    return flag;
  }
  static checkboxRequired(control) {
    let flag = null;
    if (control.value && control.value.length == 0) {
      flag = {
        required: true
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

  static isProgramNumberUnique(programService, cfdaCode, id, cookie, OrgId ) {
    return (control) => {
      const q = new Promise((resolve, reject) => {
        setTimeout(() => {
          let programNum = cfdaCode+'.'+control.value;
          programService.isProgramNumberUnique(programNum, id, cookie, OrgId).subscribe(res => {
            if(!res['content']['isProgramNumberUnique']) {
              resolve({'duplicateProgram': true});
            } else {
              resolve(null);
            }
          });
        }, 1000);
      });
      return q;
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

  static radioButtonRequired(control: AbstractControl): ValidationErrors | null {
    let error: ValidationErrors = {
      required: true
    };

    if (!control.value) {
      return error;
    }

    return null;
  }

  static selectRequired(control: AbstractControl): ValidationErrors | null {
    let error: ValidationErrors = {
      required: true
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
}

