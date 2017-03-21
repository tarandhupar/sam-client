import { Injectable, Directive, Input, OnChanges } from '@angular/core';
import 'rxjs/add/operator/map';
import { FHService } from '../fh/fh.service';
import { SuggestionsService } from '../search/suggestions.service';
import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { Observable }    from 'rxjs/Observable';

@Injectable()
export class AutoCompleteWrapper implements AutocompleteService{
  private target = "search";
  constructor(private oFHService:FHService, private oSearchService:SuggestionsService) {}

  search(oData, name) {
    switch(name) {
      case "suggestions":
            return this.oSearchService.autosearch(oData);
      
      case "agencypicker":
            return this.oFHService.search(oData);
    }
  }
  
  //sam-ui-kit autocomplete
  fetch(val: any, endOfList: boolean) {
    if(this.target=="search"){
      if(val.length>3){
        return this.oSearchService.autosearch({
          index: "",
          keyword: val
        });
      }
    }
    return Observable.of([]);
  }
  
  setFetchMethod(newVal){
    this.target = newVal;
  }
}

@Directive({
  selector: 'sam-autocomplete[autofill-suggestions]',
  providers: [
    { provide: AutocompleteService, useClass: AutoCompleteWrapper }
  ]
})
export class SuggestionsServiceDirective implements OnChanges {
  @Input('index') index: string;
  constructor(private autocompleteService: AutocompleteService){}
  ngOnInit(){
    this.autocompleteService['autocompleteIndex'] = this.index;
  }
  ngOnChanges(){
    this.autocompleteService['autocompleteIndex'] = this.index;
  }
}