import { Directive, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { LocationService } from 'api-kit/location/location.service';

@Injectable()
export class CountryServiceImpl implements AutocompleteService {

  constructor(private locationService: LocationService) { }

  getAllCountriesJSON(q:string): ReplaySubject<any> {
    const results = new ReplaySubject();
    this.locationService.getAutoCompleteCountries(q).subscribe(
      (res) => {
        results.next(res._embedded.countryList.reduce( (prev, curr) => {
          const newObj = {
            key: curr.countrycode.toString(),
            value: curr.country.toString()
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

  fetch(val: string, pageEnd: boolean, searchOptions?: any): Observable<any> {
    return this.getAllCountriesJSON(val).map(o => o);
  }
}

@Directive({
  selector: 'sam-autocomplete[country]',
  providers: [
    {provide: AutocompleteService, useClass: CountryServiceImpl}
  ]
})
export class SamCountryServiceAutoDirective {}
