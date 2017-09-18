import { Directive, Injectable, Input } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { LocationService } from 'api-kit/location/location.service';

@Injectable()
export class CityServiceImpl implements AutocompleteService {

  public countryCode = null;
  public stateId = null;
  private country;

  constructor(private locationService: LocationService) { }

  getCitiesByStateId(city, stateId, countryCode): ReplaySubject<any> {
    const results = new ReplaySubject();
    this.locationService.getAutoCompleteCities(city, stateId, countryCode)
      .catch(res => {
        if (res.status === 404) {
          return Observable.of({_embedded: {cityList: []}});
        }
      })
      .subscribe(
      (res) => {
        results.next(res._embedded.cityList.reduce( (prev, curr) => {
          const newObj = {
            key: curr.cityCode.toString(),
            value: curr.city + ", " + curr.state.stateCode
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
    let state = searchOptions && searchOptions.state;
    let country = searchOptions && searchOptions.country ?
                    searchOptions.country :
                    this.country;
    return this.getCitiesByStateId(val, state, country);
  }

  setCountry(country: string) {
    return this.country = country;
  }
}

@Directive({
  selector: 'sam-autocomplete[city]',
  providers: [
    {provide: AutocompleteService, useClass: CityServiceImpl}
  ]
})
export class SamCityServiceAutoDirective {
  @Input() country: string;

  private autocompleteService: any;

  constructor(autocompleteService: AutocompleteService) {
    // Cast to any since we have to use Typescript
    // metadata for injection, but we actually need
    // CityServiceImpl's additional methods
    this.autocompleteService = autocompleteService;
  }

  ngOnChanges() {
    // When country input on directive changes,
    // update service with new value
    if (this.country) {
      this.autocompleteService.setCountry(this.country);
    }
  }
}



