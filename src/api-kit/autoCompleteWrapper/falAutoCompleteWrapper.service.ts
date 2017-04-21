import {Injectable, Directive, Input, OnChanges} from '@angular/core';
import 'rxjs/add/operator/map';
import {AutocompleteService} from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import {Observable}    from 'rxjs/Observable';
import {ProgramService} from "../program/program.service";
import {ReplaySubject} from "rxjs";

@Injectable()
export class FALProgramAutoCompleteWrapper implements AutocompleteService {
  private target = "search";
  autocompleteValue = "";
  constructor(private oProgramService: ProgramService) {
  }

  getRelatedPrograms(q: string): ReplaySubject<any> {
    const results = new ReplaySubject();
    this.oProgramService.falautosearch(q, '').subscribe(
      (res) => {
        results.next(res.reduce((prev, curr) => {
          const newObj = {
            code: curr.id,
            name: curr.value
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

  fetch(val: string, pageEnd: boolean, serviceOptions: any): Observable<any> {
    if(val.length > 2) {
      return this.getRelatedPrograms(val).map(o => o);
    } else {
      return Observable.of([]);
    }
  }

  setFetchMethod(newVal) {
    this.target = newVal;
  }
}

@Directive({
  selector: 'sam-autocomplete[autofill-falRelProgram]',
  providers: [
    {provide: AutocompleteService, useExisting: FALProgramAutoCompleteWrapper}
  ]
})
export class FAlProgramServiceDirective {
  constructor(private autocompleteService: AutocompleteService) {
  }
}
