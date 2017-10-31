import { Directive, Injectable, Input, OnChanges, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { PscService } from 'api-kit/psc/psc.service';
import { AlertFooterService } from 'app/app-components/alert-footer/alert-footer.service';//this will be moved into sam-ui-kit soon

@Injectable()
export class PscServiceImpl implements AutocompleteService {

  active = 'Y';

  constructor(private pscService: PscService) { }

  //sam-ui-kit autocomplete
  fetch(val: any, endOfList: boolean, serviceOptions: any) {
    if(val.length>0){
      let activeVal = serviceOptions && serviceOptions.active ?
                serviceOptions.active :
                this.active;
      return this.pscService.searchPsc(activeVal, val).map(data => {
        return data._embedded.productServiceCodeList.map((value)=>{
          let valSuffix =  '*';
          let newObj = {
            key:value.pscCode,
            value: value.pscCode + " - " + value.pscName
          };
          if(value.activeInd === 'N') {
            newObj.value = newObj.value + valSuffix;
          }
          return newObj;
        });
      });
    }
    return this.getAllActiveTopLevelPscs();
  }

  getAllActiveTopLevelPscs() {
    return this.pscService.getTopLevelActivePscs().map(data => {
      return data._embedded.productServiceCodeList.map((value)=>{
          let newObj = {
            key:value.pscCode,
            value: value.pscCode + " - " + value.pscName
          };
        return newObj;
      });
    });
  }

  setFetchMethod(_?: any): any {}

  setActive(active: any) {
    this.active = active;
  }
}

@Directive({
  selector: 'sam-autocomplete[pscpicker-autofill],sam-autocomplete-multiselect[pscpicker-autofill]',
  providers: [
    { provide: AutocompleteService, useClass: PscServiceImpl }
  ]
})
export class SamPscServiceDirective implements  OnInit {
  @Input() activeVal: any;
  private autocompleteService: any;

  constructor(autocompleteService: AutocompleteService) {
    // Cast to any since we have to use Typescript
    // metadata for injection, but we actually need
    // PscServiceImpl's additional methods
    this.autocompleteService = autocompleteService;
  }

  ngOnInit() {
    // When active input on directive changes,
    // update service with new value
    if (this.activeVal) {
      this.autocompleteService.setActive(this.activeVal);
    } else {
      // If no active input is set, default to 'Y'
      this.autocompleteService.setActive('Y');
    }
  }
}



