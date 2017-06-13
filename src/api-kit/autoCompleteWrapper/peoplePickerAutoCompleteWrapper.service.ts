import { Injectable, Directive, Input, OnChanges } from '@angular/core';
import 'rxjs/add/operator/map';
import { PeoplePickerService } from '../people-picker/people-picker.service';
import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { Observable }    from 'rxjs/Observable';

@Injectable()
export class PeoplePickerAutoCompleteWrapper implements AutocompleteService{
  constructor(private oPeoplePickerService:PeoplePickerService) {}
  
  //sam-ui-kit autocomplete
  fetch(val: any, endOfList: boolean, serviceOptions: any) {
    if(val.length>3){
      if(val.indexOf("@") != -1){
        return this.oPeoplePickerService.getFilteredList({
            email: val
        }).map(data => {
          return data.map((value)=>{
            return value.user;
          });
        });
      } else {
        let qsObj = {};
        if(val.indexOf(" ") != -1){
          let valArray = val.split(" ");
          qsObj['firstName'] = valArray[0];
          qsObj['lastName'] = valArray[1];
        } else {
          qsObj['firstName'] = val;
        }
        return this.oPeoplePickerService.getFilteredList(qsObj).map(data => {
          return data.map((value)=>{
            return value.user;
          });
        });
      }
    }
    return Observable.of([]);
  }
  
  setFetchMethod(newVal){
    
  }
}

@Directive({
  selector: 'sam-autocomplete[peoplepicker-autofill],sam-autocomplete-multiselect[peoplepicker-autofill]',
  providers: [
    { provide: AutocompleteService, useClass: PeoplePickerAutoCompleteWrapper }
  ]
})
export class PeoplePickerAutoCompleteDirective {
}