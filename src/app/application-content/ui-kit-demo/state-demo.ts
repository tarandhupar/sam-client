import { Directive, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { AutocompleteService } from '../../../sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.service';
import { LocationService } from 'api-kit/location/location.service';

@Injectable()
export class StateServiceImpl implements AutocompleteService {

		// Location Service Demo

	  locationAllStateJSON;

	  locationResultModel = "";
	  locationResultConfig = {
	    options: []
	  };

	constructor(private locationService: LocationService) { }

	getAllStatesJSON(q:string): ReplaySubject<any> {
		const results = new ReplaySubject();
		this.locationService.getAutoCompleteStates(q,'USA').subscribe(
		  (res) => {
		    results.next(res._embedded.stateList.reduce( (prev, curr) => {
		    	const newObj = {
		    		key: curr.stateId.toString(),
		    		value: curr.state.toString()
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
  
  setFetchMethod(_?: any): any {

  }

  fetch(val: string, pageEnd: boolean): Observable<any> {
  	return this.getAllStatesJSON(val).map(o => o);
  }
}

@Directive({
	selector: 'sam-autocomplete[state]',
	providers: [
		{provide: AutocompleteService, useClass: StateServiceImpl}
	]
})
export class StateServiceDirective {}