import { Directive, Injectable, Input, OnChanges } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { LocationService } from 'api-kit/location/location.service';
import { AlertFooterService } from 'app/app-components/alert-footer/alert-footer.service';//this will be moved into sam-ui-kit soon

@Injectable()
export class CountyServiceImpl implements AutocompleteService {

  private state;

  private city;

  constructor(private locationService: LocationService) { }

  getAllCountiesJSON(q?:string , searchby?: string, statecode?: string, city?: string): ReplaySubject<any> {
    const results = new ReplaySubject();
    this.locationService.getAutoCompleteCounties(q,searchby, statecode, city )
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
    
   let stateCode ;
   let city;
   
  
    if(this.city){

         city = searchOptions && searchOptions.city ?
                    searchOptions.city : this.city;
         stateCode = searchOptions && searchOptions.state.statecode ?
                    searchOptions.state.statecode : this.state;
          return this.getAllCountiesJSON('','statecode','statecode',city.city).map(o => o);
        
     }

     else if (this.state){
        stateCode = searchOptions && searchOptions.statecode ?
                    searchOptions.statecode : this.state;
        return this.getAllCountiesJSON(val,'statecode',stateCode).map(o => o);
    }

     else {
         return this.getAllCountiesJSON(val).map(o => o);
     }    
    
  }

   setState(state: any) {
    this.state = state;
  }

   setCity(city: any) {
    this.city = city;
  }
}

@Directive({
  selector: '[county]',
  providers: [
    {provide: AutocompleteService, useClass: CountyServiceImpl}
  ]
})
export class SamCountyServiceAutoDirective implements OnChanges{
  @Input() stateVal: any;

  @Input() cityVal: any;

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
    if (this.stateVal) {
      this.autocompleteService.setState(this.stateVal.key);
    }

    else{
      this.autocompleteService.setState('');
    }

   
    if (this.cityVal ){
         

      this.autocompleteService.setCity(this.cityVal)
    }

    else {
      this.autocompleteService.setCity('')
    }
    // } else {
    //   // If no country is set, default to USA
    //   this.autocompleteService.setState('AL');
    // }
  }

}
