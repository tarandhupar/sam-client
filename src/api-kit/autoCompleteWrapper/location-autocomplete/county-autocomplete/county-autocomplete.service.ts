import { Directive, Injectable, Input, OnChanges } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { AutocompleteService } from 'sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.service';
import { LocationService } from 'api-kit/location/location.service';
import { AlertFooterService } from 'app/app-components/alert-footer/alert-footer.service';//this will be moved into sam-ui-kit soon

@Injectable()
export class CountyServiceImpl implements AutocompleteService {

  private state;

  private city;

  private zip;

  private country;

  constructor(private locationService: LocationService) { }

  getAllCountiesJSON(q?:string , searchby?: string, statecode?: string, city?: string , country?: string): ReplaySubject<any> {
    const results = new ReplaySubject();
    this.locationService.getAutoCompleteCounties(q,searchby, statecode, city, country )
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
            key: curr.countyCode,
            value: this.state ? curr.county : curr.county + ", " + curr.state.stateCode
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
   let country;
   

    if(this.zip){
           
         return this.getAllCountiesJSON(val,'zipcode',this.zip,undefined).map(o => o);
      }
  
    if(this.city){

          city = searchOptions && searchOptions.city ?
                    searchOptions.city : this.city;
          stateCode = searchOptions && searchOptions.state.statecode ?
                    searchOptions.state.statecode : this.state;
          country = searchOptions && searchOptions.state.country.countrycode ?
          searchOptions.state.country.countrycode : this.country;

          return this.getAllCountiesJSON('','statecode',stateCode,city.city,this.country.key).map(o => o);
        
     }

     else if (this.state && this.country){
        stateCode = searchOptions && searchOptions.statecode ?
                    searchOptions.statecode : this.state;
        country = searchOptions && searchOptions.country ?
                    searchOptions.country :
                    this.country;
        return this.getAllCountiesJSON(val,'statecode',stateCode,'', this.country.key).map(o => o);
    }

     else if(this.country){
          country = searchOptions && searchOptions.country ?
                    searchOptions.country :
                    this.country;
          return this.getAllCountiesJSON(val,'','','',this.country.key).map(o => o);
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

  setZip(zip: any) {
    this.zip = zip;
  }

  setCountry(country: any) {
    return this.country = country;
  }
}

@Directive({
  selector: '[county]',
  providers: [
    {provide: AutocompleteService, useClass: CountyServiceImpl}
  ]
})
export class SamCountyServiceAutoDirective implements OnChanges{
  @Input() stateValCounty: any;

  @Input() cityValCounty: any;

  @Input() zipValCounty: any;

  @Input() countryValCounty: any;

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
    if (this.stateValCounty) {
      this.autocompleteService.setState(this.stateValCounty.key);
    }

    else{
      this.autocompleteService.setState('');
    }

   if (this.cityValCounty ){
      this.autocompleteService.setCity(this.cityValCounty)
    }

    else {
      this.autocompleteService.setCity('')
    }

    if (this.zipValCounty){
      this.autocompleteService.setZip(this.zipValCounty)
    }

    else {
      this.autocompleteService.setZip('')
    }

    if (this.countryValCounty){
      this.autocompleteService.setCountry(this.countryValCounty)
    }

    else {
      this.autocompleteService.setCountry('')
    }
    
  }

}
