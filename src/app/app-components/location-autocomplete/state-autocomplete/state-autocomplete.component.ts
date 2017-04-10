import { Directive, Injectable, Input } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { LocationService } from 'api-kit/location/location.service';

@Injectable()
export class StateServiceImpl implements AutocompleteService {

  country = "USA";

  constructor(private locationService: LocationService) { }

  getAllStatesJSON(q:string, country:string): ReplaySubject<any> {
    console.log(this.country);
    const results = new ReplaySubject();
    this.locationService.getAutoCompleteStates(q,country).subscribe(
      (res) => {
        results.next(res._embedded.stateList.reduce( (prev, curr) => {
          const newObj = {
            key: curr.stateId.toString(),
            value: curr.state.toString()
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

  setFetchMethod(_?: any): any {
    this.country = _.value;
  }

  fetch(val: string, pageEnd: boolean): Observable<any> {
    console.log(this.country);
    return this.getAllStatesJSON(val, this.country).map(o => o);
  }
}

@Directive({
  selector: 'sam-autocomplete[state]',
  providers: [
    {provide: AutocompleteService, useClass: StateServiceImpl}
  ]
})
export class SamStateServiceAutoDirective {

  @Input() countryModel: any;

  constructor(private service: StateServiceImpl) {}


  ngOnChanges() {
    console.log(this.countryModel);
    let country = this.countryModel === undefined ? {value:'USA'}:this.countryModel;
    this.service.setFetchMethod(country);
  }
}



