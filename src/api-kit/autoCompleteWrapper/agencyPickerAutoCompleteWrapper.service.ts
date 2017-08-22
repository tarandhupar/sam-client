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
          obj['name'] = this._titleCase(obj['name']);
          return obj;
        });
      } else {
        return [];
      }
    });
  }
  
  setFetchMethod(newVal){
    
  }

  //should match what's in app/app-pipes/fhTitleCase.pipe
  _titleCase(phrase:string){
    if (!phrase || !phrase.length) {
      return '';
    }

    var phraseArr = phrase.toLowerCase().split(" ");
    var revised = "";
    let capitalizeAll = ["u.s.","ii","iii"];
    let doNotCapitalize	= ["a", "an", "and", "as", "at", "but", "by", "etc", "for", "in", "into", "is", "nor", "of", "off", "on", "onto", "or", "so", "the", "to", "unto", "via"];
    for ( var i = 0; i < phraseArr.length; i++ ) {
      let piece = phraseArr[i];
      if (i==0) {
        piece = piece.charAt(0).toUpperCase() + piece.substring(1,piece.length);;
      }
      
      if (capitalizeAll.indexOf(piece.toLowerCase())!=-1){
        piece = piece.toUpperCase();
      }
      else if(piece.charAt(0)=="(" && piece.charAt(piece.length-1)==")"){
        piece = piece.toUpperCase();
      }
      else if(doNotCapitalize.indexOf(piece)==-1){
        piece = piece.charAt(0).toUpperCase() + piece.substring(1,piece.length);
      }
      phraseArr[i] = piece;
    }
    return phraseArr.join(" ");
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