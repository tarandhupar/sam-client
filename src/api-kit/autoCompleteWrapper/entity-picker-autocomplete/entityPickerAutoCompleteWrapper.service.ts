import { Injectable, Directive, Input, OnChanges } from '@angular/core';
import 'rxjs/add/operator/map';
import { UserAccessMock } from '../../access/access.service.mock';
import { UserAccessService } from '../../access/access.service';
import { AutocompleteService } from 'sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EntityPickerAutoCompleteWrapper implements AutocompleteService{

  searchStartLimit: number = 3;
  pageNum: number = 1;
  resultList: any = [];
  existingVal: any;

  isDefaultOrg: boolean = false;
  isAssignableOrg: boolean = false;

  constructor(private accessService:UserAccessService) {}

  //sam-ui-kit autocomplete
  fetch(val: any, endOfList: boolean, serviceOptions: any) {
    if(val.length < this.searchStartLimit) return Observable.of([]);
    // if(this.existingVal !== val) {
    //   this.pageNum = 1;
    // }else {
    //   if (endOfList) this.pageNum++;
    // }

    this.existingVal = val;
    return this.accessService.getEntityAutoComplete(val, false, this.pageNum, AUTOCOMPLETE_RECORD_PER_PAGE, this.isDefaultOrg, this.isAssignableOrg).map(res => {
      if(res != null && res.length > 0) {
        const list = res.map((val)=>{
          let obj = val;
          obj['key'] = obj['cageCode'];
          obj['name'] = obj['legalBusinessName'];
          obj['detail'] = 'CAGE: ' + val['cageCode'] + ' | DUNS: '+val['duns'];
          obj['address'] = this.formatAddressStr(val['address']);
          return obj;
        });
        this.pageNum >= 2? this.resultList.concat(list): this.resultList = list;

        return this.resultList;
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
  @Input() isDefaultOrg: boolean = false;
  @Input() isAssignableOrg: boolean = false;

  constructor(private autocompleteService: AutocompleteService){}

  ngOnInit(){
    this.autocompleteService['isDefaultOrg'] = this.isDefaultOrg;
    this.autocompleteService['isAssignableOrg'] = this.isAssignableOrg;
  }

}
