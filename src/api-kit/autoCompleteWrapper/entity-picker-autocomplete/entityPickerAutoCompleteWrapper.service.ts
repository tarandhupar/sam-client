import { Injectable, Directive, Input, OnChanges } from '@angular/core';
import 'rxjs/add/operator/map';
import { UserAccessMock } from '../../access/access.service.mock';
import { UserAccessService } from '../../access/access.service';
import { AutocompleteService } from 'sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EntityPickerAutoCompleteWrapper implements AutocompleteService{
  constructor(private accessService:UserAccessService) {}

  //sam-ui-kit autocomplete
  fetch(val: any, endOfList: boolean, serviceOptions: any) {
    return this.accessService.getUserAutoComplete(val, false).map(res => {
      if(res && res.length > 0) {
        return res.map((val)=>{
          let obj = val;
          obj['key'] = obj['cageCode'];
          obj['name'] = obj['legalBusinessName'];
          obj['detail'] = 'CAGE: ' + val['cageCode'] + ' | DUNS: '+val['duns'];
          obj['address'] = this.formatAddressStr(val['address']);
          return obj;
        });
      } else {
        return [];
      }
    });
  }

  setFetchMethod(newVal){}

  formatAddressStr(address){
    let addrParts = address.split(',');
    let cityName = addrParts[0];
    let cityParts = cityName.split(' ');
    let formatedParts = cityParts.map(part => {return part.charAt(0)+part.substring(1).toLowerCase();});
    addrParts[0] = formatedParts.join(' ');
    return addrParts.join(',');
  }
}

@Directive({
  selector: 'sam-autocomplete[entitypicker-autofill],sam-autocomplete-multiselect[entitypicker-autofill]',
  providers: [
    { provide: AutocompleteService, useClass: EntityPickerAutoCompleteWrapper }
  ]
})
export class EntityPickerAutoCompleteDirective {
}
