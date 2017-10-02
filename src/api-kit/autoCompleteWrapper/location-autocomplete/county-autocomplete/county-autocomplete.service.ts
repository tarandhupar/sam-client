import { Directive, Injectable, Input, OnChanges } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { LocationService } from 'api-kit/location/location.service';
import { AlertFooterService } from 'app/app-components/alert-footer/alert-footer.service';//this will be moved into sam-ui-kit soon

@Injectable()
export class CountyServiceImpl implements AutocompleteService {

  private state = 'AL';

  constructor(private locationService: LocationService) { }

  getAllCountiesJSON(q:string , statecode: string): ReplaySubject<any> {
    const results = new ReplaySubject();
    this.locationService.getAutoCompleteCounties(q,'statecode', statecode)
	 .catch(res => {
        return Observable.of([]);
      })
	  .subscribe(
      (res) => {
	  const list = res && res['_embedded'] && res['_embedded'].countyList ?
                        res['_embedded'].countyList :
                        [];
        results.next(list.reduce( (prev, curr) => {
          const newObj = {
            key: curr.countyId.toString(),
            value: curr.county + ", " + curr.state.stateCode
          }
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
    let statecode = searchOptions && searchOptions.statecode ?
                    searchOptions.statecode : this.state;
                    console.log(this.state);
                    console.log(statecode);
    return this.getAllCountiesJSON(val,statecode).map(o => o);
  }

   setState(state: any) {
    this.state = state;
  }
}

@Directive({
  selector: '[county]',
  providers: [
    {provide: AutocompleteService, useClass: CountyServiceImpl}
  ]
})
export class SamCountyServiceAutoDirective implements OnChanges{
  @Input() state: any;

  private autocompleteService: any;

  constructor(autocompleteService: AutocompleteService) {
    // Cast to any since we have to use Typescript
    // metadata for injection, but we actually need
    // StateServiceImpl's additional methods
    this.autocompleteService = autocompleteService;
  }

  ngOnChanges() {
    // When state input on directive changes,
    // update service with new value
    if (this.state) {
      this.autocompleteService.setState(this.state.key);
    }
    // } else {
    //   // If no country is set, default to USA
    //   this.autocompleteService.setState('AL');
    // }
  }

}
