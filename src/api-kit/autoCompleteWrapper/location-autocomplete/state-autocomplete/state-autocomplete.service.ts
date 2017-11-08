import { Directive, Injectable, Input, OnChanges } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { AutocompleteService } from 'sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.service';
import { LocationService } from 'api-kit/location/location.service';
import { AlertFooterService } from 'app/app-components/alert-footer/alert-footer.service';//this will be moved into sam-ui-kit soon

@Injectable()
export class StateServiceImpl implements AutocompleteService {

  country = "USA";

  constructor(private locationService: LocationService) { }

  getAllStatesJSON(q?:string, country?:string): ReplaySubject<any> {
    const results = new ReplaySubject();
    this.locationService.getAutoCompleteStates(q,country)
      .catch(res => {
        return Observable.of([]);
      })
      .subscribe(
      (res) => {
        const list = res && res['_embedded'] && res['_embedded'].stateList ?
                        res['_embedded'].stateList :
                        [];

        results.next(list.reduce( (prev, curr) => {
          const newObj = {
            key: curr.stateCode.toString(),
            value: curr.stateCode + " - " + curr.state
          };
          const returnObj = Object.assign({}, curr, newObj);
          prev.push(returnObj);
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
    let country = searchOptions && searchOptions.country ?
                    searchOptions.country :
                    this.country;
    return this.getAllStatesJSON(val, country).map(o => o);
  }

  setCountry(country: any) {
    this.country = country;
  }
}

@Directive({
  // selector: 'sam-autocomplete[state]',
  // To Change Syntax to use this directive only for sam-autocomplete and sam-autocomplete-multiselect
  selector: '[state]',
  providers: [
    {provide: AutocompleteService, useClass: StateServiceImpl}
  ]
})
export class SamStateServiceAutoDirective implements OnChanges {
  @Input() countryValState: any;
  private autocompleteService: any;

  constructor(autocompleteService: AutocompleteService) {
    // Cast to any since we have to use Typescript
    // metadata for injection, but we actually need
    // StateServiceImpl's additional methods
    this.autocompleteService = autocompleteService;
  }

  ngOnChanges() {
    // When country input on directive changes,
    // update service with new value
    if (this.countryValState) {
      this.autocompleteService.setCountry(this.countryValState.key);
    } else {
      // If no country is set, default to USA
      this.autocompleteService.setCountry('USA');
    }
  }
}



