import { Directive, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { LocationService } from 'api-kit/location/location.service';

@Injectable()
export class CountyServiceImpl implements AutocompleteService {

  constructor(private locationService: LocationService) { }

  getAllCountiesJSON(q:string): ReplaySubject<any> {
    const results = new ReplaySubject();
    this.locationService.getAutoCompleteCounties(q,'VA').subscribe(
      (res) => {
        results.next(res._embedded.countyList.reduce( (prev, curr) => {
          const newObj = {
            key: curr.countyId.toString(),
            value: curr.county.toString()
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

  setFetchMethod(_?: any): any {}

  fetch(val: string, pageEnd: boolean): Observable<any> {
    return this.getAllCountiesJSON(val).map(o => o);
  }
}

@Directive({
  selector: 'sam-autocomplete[county]',
  providers: [
    {provide: AutocompleteService, useClass: CountyServiceImpl}
  ]
})
export class SamCountyServiceAutoDirective {}
