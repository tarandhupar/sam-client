import { Directive, Injectable, Input } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { LocationService } from 'api-kit/location/location.service';

@Injectable()
export class CityServiceImpl implements AutocompleteService {

  private state;
  private country;
  private county;

  constructor(private locationService: LocationService) { }

  getAllCities(city?:string, searchby?: string, stateCode?:string, countryCode?:string, county?:string): ReplaySubject<any> {
    const results = new ReplaySubject();
    this.locationService.getAutoCompleteCities(city,searchby,stateCode, countryCode, county )
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
    let stateCode;
    let country;
    let county;
    let zip;
    
  

      if(this.zip){
        return this.getAllCities(val,'zipcode',this.zip,undefined, undefined).map(o => o);
      }

          
      if(this.county ){
        
           county = searchOptions && searchOptions.county ?
                    searchOptions.county : this.county;
            stateCode = searchOptions && searchOptions.state.statecode ?
                    searchOptions.state.statecode : this.state;
            country = searchOptions && searchOptions.state.country.countrycode ?
                    searchOptions.state.country.countrycode :
                    this.country;
            return this.getAllCities(val,'statecode',stateCode,country, county.county).map(o => o);
      }

      

      
      //operations without County
      else if(this.state && this.country){
          stateCode = searchOptions && searchOptions.statecode ?
                    searchOptions.statecode : this.state;
          country = searchOptions && searchOptions.country ?
                    searchOptions.country :
                    this.country;

          return this.getAllCities(val,'statecode',stateCode,country).map(o => o);
        }

     else if(this.state){
            stateCode = searchOptions && searchOptions.statecode ?
                    searchOptions.statecode : this.state;
            return this.getAllCities(val,'statecode',stateCode,'').map(o => o);
      }

      else if(this.country){
          country = searchOptions && searchOptions.country ?
                    searchOptions.country :
                    this.country;
          return this.getAllCities(val,'','', country).map(o => o);
      }

       else {
          
          return this.getAllCities(val).map(o => o);
      }

      
    }
  
  setCountry(country: any) {
    return this.country = country;
  }

  setState(state: any) {
    return this.state = state;
  }

  setCounty(county: any) {
    return this.county = county;
  }

  setZip(zip: any) {
    return this.zip = zip;
  }
}

@Directive({
  selector: '[city]',
  providers: [
    {provide: AutocompleteService, useClass: CityServiceImpl}
  ]
})
export class SamCityServiceAutoDirective {
  @Input() countryValCity: any;
  @Input() countyValCity: any;
  @Input() stateValCity: any;
  @Input() zipValCity: any;

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
    if (this.countryValCity) {
      this.autocompleteService.setCountry(this.countryValCity.key);
    }

    else{
      this.autocompleteService.setCountry('');
    }

    if (this.stateValCity) {
      this.autocompleteService.setState(this.stateValCity.key);
    }

    else{
      this.autocompleteService.setState('');
    }

    if (this.countyValCity) {
      this.autocompleteService.setCounty(this.countyValCity);
    }

    else{
      this.autocompleteService.setCounty('');
    }

    if (this.zipValCity){
      this.autocompleteService.setZip(this.zipValCity);
    }

    else {
      this.autocompleteService.setZip('');
      
    }
  }
}



