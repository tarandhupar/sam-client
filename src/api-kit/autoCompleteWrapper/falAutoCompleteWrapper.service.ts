import {Injectable, Directive, Input, OnChanges} from '@angular/core';
import 'rxjs/add/operator/map';
import {AutocompleteService} from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import {Observable}    from 'rxjs/Observable';
import {ProgramService} from "../program/program.service";
import {ReplaySubject} from "rxjs";
import {DictionaryService} from "../dictionary/dictionary.service";

@Injectable()
export class FALProgramAutoCompleteWrapper implements AutocompleteService {
  private target = "search";

  constructor(private oProgramService: ProgramService, private oDictionaryService: DictionaryService) {
  }

  getData(q: string, index: string): ReplaySubject<any> {
    let dictionaryName = 'program_subject_terms';
    let size = '100';
    const results = new ReplaySubject();
    if (index === 'RP') {
      this.oProgramService.falautosearch(q, '').subscribe(
        (res) => {
          results.next(res.reduce((prev, curr) => {

            const newObj = {
              code: curr.id,
              name: curr.code +' - '+ curr.value
            }
            prev.push(newObj);
            return prev;
          }, []));
        },
        (error) => {
          return error;
        }
      );
    }

    if (index === 'D') {
      this.oDictionaryService.getDictionaryById(dictionaryName, size,'',q).subscribe((res) => {
          results.next(res['program_subject_terms'].reduce((prev, curr) => {
            const newObj = {
              code: curr.element_id,
              name: curr.value
            };
            prev.push(newObj);
            return prev;
          }, []));
        },
        (error) => {
          return error;
        }
      );
    }
    return results;

  }

  fetch(val: string, pageEnd: boolean, serviceOptions: any): Observable<any> {
    if (val.length >= 2) {
      return this.getData(val, serviceOptions.index).map(o => o);
    } else {
      return Observable.of([]);
    }
  }

  setFetchMethod(newVal) {
    this.target = newVal;
  }
}

@Directive({
  selector: 'sam-autocomplete[autofill-falProgram]',
  providers: [
    {provide: AutocompleteService, useExisting: FALProgramAutoCompleteWrapper}
  ]
})
export class FAlProgramServiceDirective {
}
