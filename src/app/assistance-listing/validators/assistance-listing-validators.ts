import { AbstractControl } from "@angular/forms";
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

  static atLeastOneEntryCheck(control){
    let flag = null;
    if(control.value.length == 0){
      flag = {atLeastOneEntryCheck: true};
    }
    return flag;
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
      flag = {"urlError": true};

    return flag;
  }

  static checkEmailPattern(control){
    let flag = null;
    let pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if(control.value && !pattern.test(control.value))
      flag = {"emailError": true};

    return flag;
  }
}

