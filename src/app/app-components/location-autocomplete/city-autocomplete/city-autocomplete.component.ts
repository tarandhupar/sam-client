import { Directive, Injectable, Input } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { LocationService } from 'api-kit/location/location.service';

@Injectable()
export class CityServiceImpl implements AutocompleteService {

  public countryCode = null;
  public stateId = null;

  constructor(private locationService: LocationService) { }

  getCitiesByStateId(city, stateId, countryCode): ReplaySubject<any> {
    const results = new ReplaySubject();
    this.locationService.getAutoCompleteCities(city, stateId, countryCode).subscribe(
      (res) => {
        results.next(res._embedded.cityList.reduce( (prev, curr) => {
          const newObj = {
            key: curr.cityCode.toString(),
            value: curr.city
          };
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
    console.log(searchOptions);
    return this.getCitiesByStateId(val, this.stateId, this.countryCode);
  }
}

@Directive({
  selector: 'sam-autocomplete[city]',
  providers: [
    {provide: AutocompleteService, useClass: CityServiceImpl}
  ]
})
export class SamCityServiceAutoDirective {}



