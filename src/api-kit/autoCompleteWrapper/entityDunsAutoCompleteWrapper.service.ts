import { Injectable, Directive, Input, OnChanges } from '@angular/core';
import 'rxjs/add/operator/map';
import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';

import { SearchDictionariesService} from "../search/search-dictionaries.service";
import {Observable, ReplaySubject} from "rxjs";

// service to call backend
@Injectable()
export class DunsEntityAutoCompleteWrapper implements AutocompleteService{
  private target = "search";
  autocompleteIndex = "";
  constructor(private oSearchService:SearchDictionariesService) {}


  getEntityDuns(q: string): ReplaySubject<any> {
    const results = new ReplaySubject();
    this.oSearchService.dunsEntityAutoSearch(q).subscribe(
      (res) => {
        results.next(res.reduce((prev, curr) => {
          const newObj = {
            value: curr.elementId,
            label: curr.value
          }
          prev.push(newObj);
          return prev;
        }, []));
      },
      (error) => {
        return error;
      }
    );
    return results;
  }

  fetch(val: string): Observable<any> {
    if(val.length > 2) {
      return this.getEntityDuns(val).map(o => o);
    } else {
      return Observable.of([]);
    }
  }

  setFetchMethod(newVal){
    this.target = newVal;
  }
}

//directive to add to template
@Directive({
  selector: 'sam-autocomplete[autofill-entityduns]',
  providers: [
    { provide: AutocompleteService, useClass: DunsEntityAutoCompleteWrapper }
  ]
})
export class EntitySuggestionsServiceDirective {
  constructor(private autocompleteService: AutocompleteService){}
}
