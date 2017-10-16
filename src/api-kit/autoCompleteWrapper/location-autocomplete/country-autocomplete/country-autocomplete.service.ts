import { Directive, Injectable, Input, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { LocationService } from 'api-kit/location/location.service';

@Injectable()
export class CountryServiceImpl implements AutocompleteService {

  private historic ;

  constructor(private locationService: LocationService) { }

 
  
getAllCountriesJSON(q:string, historic:string): ReplaySubject<any> {
    const results = new ReplaySubject();
    this.locationService.getAutoCompleteCountries(q,historic).subscribe(
      (res) => {
        results.next(res._embedded.countryList.reduce( (prev, curr) => {
          const newObj = {
            key: curr.countrycode.toString(),
            value: curr.countrycode.toString() + " - " +  curr.country.toString()
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
    
    let active = this.historic;
    console.log(this.historic);
    return this.getAllCountriesJSON(val,active).map(o => o);
  }

  public setHistoric(historic: any) {
      this.historic = historic;
  }
  
}

@Directive({
  selector: '[country]',
  providers: [
    {provide: AutocompleteService, useClass: CountryServiceImpl}
  ]
})
export class SamCountryServiceAutoDirective implements OnInit {
 @Input() historic: any;
 

  private autocompleteService: any;

  constructor(autocompleteService: AutocompleteService) {
    // Cast to any since we have to use Typescript
    // metadata for injection, but we actually need
    // StateServiceImpl's additional methods
    this.autocompleteService = autocompleteService;
    // this.autocompleteService.setHistoric(this.historic);
  }

   ngOnInit() {
     if (this.historic){
        this.autocompleteService.setHistoric(this.historic);
     }
     
  }
}
