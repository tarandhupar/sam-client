import { Injectable, Directive, Input, OnChanges } from '@angular/core';
import 'rxjs/add/operator/map';
import { FHService } from '../fh/fh.service';
import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { Observable }    from 'rxjs/Observable';

@Injectable()
export class AgencyPickerAutoCompleteWrapper implements AutocompleteService{
  constructor(private oFHService:FHService) {}
  
  //sam-ui-kit autocomplete
  fetch(val: any, endOfList: boolean, serviceOptions: any) {
    let isCode = val && !isNaN(val);
    let parent = serviceOptions && serviceOptions['parent'] ? serviceOptions['parent'] : null;
    return this.oFHService.fhSearch(val,1,10,['active'],[],null,isCode,parent).map(res => {
      if(res["_embedded"]) {
        return res["_embedded"].map((val)=>{
          let obj = val['org'];
          obj['key'] = obj['orgKey'];
          return obj;
        });
      } else {
        return [];
      }
    });
  }
  
  setFetchMethod(newVal){
    
  }
}

@Directive({
  selector: 'sam-autocomplete[agencypicker-autofill],sam-autocomplete-multiselect[agencypicker-autofill]',
  providers: [
    { provide: AutocompleteService, useClass: AgencyPickerAutoCompleteWrapper }
  ]
})
export class AgencyPickerAutoCompleteDirective {
}