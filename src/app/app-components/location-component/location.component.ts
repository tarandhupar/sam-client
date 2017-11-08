import { Component, Input, Output, OnInit, OnChanges, OnDestroy, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AutocompleteConfig } from 'sam-ui-elements/src/ui-kit/types';
import { LocationService } from 'api-kit/location/location.service';
import { Observable } from "rxjs";

const defaultLocationObject = {
  city: '',
  county: '',
  state: '',
  country: '',
  zip: ''
}

const defaultConfig = {
  name: undefined,
  id: undefined,
  labelText: undefined,
  hint: undefined,
  useFormService: false,
  control: undefined,
  required: false,
  disabled: false,
  allowAny: false,
  config: {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    }
  }
};

@Component({
  selector: 'sam-location-component',
  templateUrl: 'location.template.html',
  providers: []
})
export class SamLocationComponent implements OnChanges, OnInit, OnDestroy {
  /**
   * An object with city, state, county, country, and zip properties
   */
  @Input() location: LocationObject = defaultLocationObject;
  /**
   * EventEmitter for location changes.
   * Angular allows double binding with [(location)] following this naming syntax.
   */
  @Output() locationChange: EventEmitter<LocationObject> = new EventEmitter<LocationObject>();

  @Input('cityConfig') public _cityConfig: LocationGroupAutocompleteConfig;
  @Input('stateConfig') public _stateConfig: LocationGroupAutocompleteConfig;
  @Input('countyConfig') public _countyConfig: LocationGroupAutocompleteConfig;
  @Input('countryConfig') public _countryConfig: LocationGroupAutocompleteConfig;
  @Input('zipConfig') public _zipConfig;

  private store;
  private subscription;

  private  error = {
    city:'',
    state:'',
    country:'',
    county:'',
    zip:'',
  };

  constructor(private locationService:LocationService) {}

  ngOnChanges() {
    if (this.store) {
      this.store.dispatch({ type: "LOCATION_CHANGE", value: this.location });
      this.store.dispatch({ type: "CITY_CONFIG_CHANGE", value: this._cityConfig });
      this.store.dispatch({ type: "COUNTY_CONFIG_CHANGE", value: this._countyConfig });
      this.store.dispatch({ type: "STATE_CONFIG_CHANGE", value: this._stateConfig });
      this.store.dispatch({ type: "COUNTRY_CONFIG_CHANGE", value: this._countryConfig });
      this.store.dispatch({ type: "ZIP_CONFIG_CHANGE", value: this._zipConfig });
    }
  }

  ngOnInit() {
    // Create initial state object
    const defaultState: any = Object.assign(
      {},
      {
        cityConfig: this._cityConfig,
        stateConfig: this._stateConfig,
        countyConfig: this._countyConfig,
        countryConfig: this._countryConfig,
        zipConfig: this._zipConfig
      }
    );
    if (this.location) {
      defaultState.location = this.location;
    }
    // Initialize store
    this.store = this.createStore(this.reducer, defaultState);
    this.subscription = this.store.subscribe(() => {
      const state = Object.assign({}, this.store.getState());
      if (this.location) {
        this.location = state.location;
        this.locationChange.emit(this.location);
      }
      this._cityConfig = state.cityConfig;
      this._stateConfig = state.stateConfig;
      this._countyConfig = state.countyConfig;
      this._countryConfig = state.countryConfig;
      this._zipConfig = state.zipConfig;
    });
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get city() {
    return this.location.city;
  }

  get state() {
    return this.location.state;
  }

  get county() {
    return this.location.county;
  }

  get country() {
    return this.location.country;
  }

  get zip() {
    return this.location.zip || '';
  }

  get cityConfig() {
    /**
     * Creates a combined config object from default values for
     * all autocomplete configs, smart defaults for city config,
     * and developer provided values from the config input
     *
     * Order of provided arguments to Object.assign matters.
     * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
     * for more info.
     */
    return Object.assign(
      defaultConfig,
      {
        name: "location group city",
        id: "location-group-city",
        labelText: "City"
      },
      this._cityConfig
    );
  }

  get stateConfig() {
    return Object.assign(
      defaultConfig,
      {
        name: "location group state",
        id: "location-group-state",
        labelText: "State/Province"
      },
      this._stateConfig
    );
  }

  get countyConfig() {
    return Object.assign(
      defaultConfig,
      {
        name: "location group county",
        id: "location-group-county",
        labelText: "County"
      },
      this._countyConfig
    );
  }

  get countryConfig() {
    return Object.assign(
      defaultConfig,
      {
        name: "location group country",
        id: "location-group-country",
        labelText: "Country"
      },
      this._countryConfig
    );
  }

  get zipConfig() {
    return Object.assign(
      defaultConfig,
      {
        name: "location group zip",
        id: "location-group-zip",
        labelText: "Zip"
      },
      this._zipConfig
    );
  }


  reducer(state: any, action: any) {

   switch (action.type) {
      case "LOCATION_CHANGE":
        return Object.assign(
          {},
          state,
          {
            location: action.value
          }
        );
      case "CITY_CONFIG_CHANGE":
        return Object.assign(
          {},
          state,
          {
            cityConfig: action.value
          }
        );
      case "COUNTY_CONFIG_CHANGE":
        return Object.assign(
          {},
          state,
          {
            countyConfig: action.value
          }
        );
      case "STATE_CONFIG_CHANGE":
        return Object.assign(
          {},
          state,
          {
            stateConfig: action.value
          }
        );
      case "COUNTRY_CONFIG_CHANGE":
        return Object.assign(
          {},
          state,
          {
            countryConfig: action.value
          }
        );
      case "ZIP_CONFIG_CHANGE":
        return Object.assign(
          {},
          state,
          {
            zipConfig: action.value
          }
        );
      case "CITY_CHANGE":
        /**
         * When city changes, clear county and zip
         * since these are many-to-many relationships.
         * Populate fields for state and country.
         */
        return Object.assign(
          {},
          state,
          {
            location: Object.assign(
              {},
              state.location,
              {
                // city: state.cityConfig && action.value ? action.value : undefined,
                city : state.cityConfig && action.value ?  state.location.country !== undefined && state.location.country.key != 'USA' ? action.value : Object.assign({}, action.value, { key: action.value.cityCode,
                            value: action.value.city }) : undefined,
                county: state.cityConfig && action.value ?  state.location.county : state.zipConfig && state.location.zip ? state.location.county : undefined,
                state: state.stateConfig && action.value && action.value.state ?
                        { key: action.value.state.stateCode,
                          value: action.value.state.stateCode + " - " + action.value.state.state } :
                        state.location.state,

                zip: state.zipConfig ? state.location.zip : '',
                country: state.countryConfig && action.value && action.value.state && action.value.state.country ?
                          { key: action.value.state.country.countrycode,
                            value: action.value.state.country.country } :
                          state.location.country,

              }
            )
          }
        );
       case "COUNTY_CHANGE":
       return Object.assign(
          {},
          state,
          {
            location: Object.assign(
              {},
              state.location,
              {
                city: state.countyConfig && action.value ? state.location.city : state.zipConfig && state.location.zip ? state.location.city : undefined,
                // county: state.countyConfig && action.value ? action.value : undefined,
                county : state.countyConfig && action.value ? state.location.country !== undefined && state.location.country.key != 'USA' ? action.value : Object.assign({}, action.value, { key: action.value.countyCode,
                           value: action.value.county }) : undefined,
                state: state.stateConfig && action.value && action.value.state ?
                        { key: action.value.state.stateCode,
                          value: action.value.state.stateCode + " - " + action.value.state.state } :
                        state.location.state,
                zip: state.zipConfig ? state.location.zip : '',
                country: state.countryConfig && action.value && action.value.state && action.value.state.country ?
                          { key: action.value.state.country.countrycode,
                            value: action.value.state.country.country } : // Provide values later
                          state.location.country

              }
            )
          }
      );
      case "STATE_CHANGE":
          return Object.assign(
            {},
            state,
            {
              location: Object.assign(
                {},
                state.location,
                {
                  city: state.countryConfig && state.location.country && state.location.country.key !== 'USA' ? state.location.city : '',
                  county: state.countryConfig && state.location.country && state.location.country.key !== 'USA' ? state.location.county : '',
                  state: state.stateConfig && action.value ? action.value : undefined,
                  zip: '', // Zip is a text field. To clear, set empty string.
                  country: state.countryConfig && action.value && action.value.country ?
                            { key: action.value.country.countrycode,
                              value: action.value.country.country } :
                            state.location.country
                }
              )
            }
        );
      
      
       /**
         * When state changes,
         * clear city, county and zip.
         * Populate country.
         */
       
      case "COUNTRY_CHANGE":
       if (state.countryConfig && action.value && action.value.key == 'USA') {
         state.stateConfig.allowAny = false;
          state.countyConfig.allowAny = false;
          state.cityConfig.allowAny = false;

          return Object.assign(
          {},
          state,
          {
            location: Object.assign(
              {},
              state.location,
              {
                city: '',
                county: '',
                state: '',
                zip: '',
                country: state.countryConfig && action.value ? action.value : undefined
              }
            )
          }
        );
       }
       else if (action.value != null && action.value.key !== 'USA'){
         state.stateConfig.allowAny = true;
               state.countyConfig.allowAny = true;
               state.cityConfig.allowAny = true;
                return Object.assign(
                {},
                state,
                {
                  location: Object.assign(
                    {},
                    state.location,
                    {
                      city: state.location.city,
                      county: state.location.county,
                      state: state.location.state,
                      zip: state.location.zip,
                      country: state.countryConfig && action.value ? action.value : undefined
                    }
                  )
                }
              );
      }
      else {
        state.stateConfig.allowAny = false;
        state.countyConfig.allowAny = false;
        state.cityConfig.allowAny = false;
        return Object.assign(
          {},
          state,
          {
            location: Object.assign(
              {},
              state.location,
              {
                city: '',
                county: '',
                state: '',
                zip: '',
                country: state.countryConfig && action.value ? action.value : undefined
              }
            )
          }
        );
      };
      /**
         * When country changes, clear all other fields.
         */
        
      case "ZIP_CHANGE":
       return Object.assign(
          {},
          state,
          {
            location: Object.assign(
              {},
              state.location,
              {
                city: state.cityConfig && action.value ? state.location.city :undefined,
                county: state.countyConfig && action.value ? state.location.county :undefined,
                state: state.stateConfig && action.value && action.value.state ?
                        { key: action.value.stateCode,  
                          value: action.value.state } :
                        state.location.state,
                zip: state.zipConfig && action.value ? action.value.zipCode : '',
                country: state.countryConfig && action.value && action.value.country && action.value.countryCode ?
                          { key: action.value.countryCode,
                            value: action.value.country } :
                          state.location.country
              }
            )
          }
        );
      default:
        return state;
    }
  }

  locationValidation(val){
   this.formatError(val);
     if(this.zip ){
       return this.locationService.validateZipWIthLocation(this.zip , this.state!== undefined ? this.state : undefined, 
                     this.city !== undefined ? this.city : undefined,
                     this.county!== undefined ? this.county : undefined);
     }
     return Observable.of({description:"INVALID"});
   }

  formatError(val){
    this.error.city = this.city?'':'City field cannot be empty';
    this.error.state = this.state?'':'State field cannot be empty';
    this.error.country = this.country?'':'Country field cannot be empty';
    this.error.zip = this.zip?'':'Zip field cannot be empty';
 }

  locationValidationZip(res){
     this.error.zip = 'Invalid zip code';
     return this.store.dispatch({ type: 'ZIP_CHANGE', value: res });
  }

  onZipChange(val){
   if (val !== '' && val !== undefined && this.country !== undefined){
     this.locationService.validateZipWIthLocation(val, this.state!== undefined ? this.state : undefined, 
                      this.city !== undefined ? this.city : undefined,
                      this.county!== undefined ? this.county : undefined)
      .catch(res => {
        return Observable.of([]);
      })
      .subscribe(
        (data) => {
          const res = data;
          if (res.description == 'VALID'){
            this.populateZipConfigData(val);
          }

          else {
            return this.locationValidationZip(res);
          }
         },
        (error) => {
           return error;
        }
      );
   }

   else {
        this.error.zip = '';
        let resVal = {"zipCode":val ,"description":""}
        return this.store.dispatch({ type: 'ZIP_CHANGE', value: resVal });
   }
  
  }

  populateZipConfigData(val){
    // if(this.state && this.country) return;
     this.locationService
                      .getCityAndCountyDetailsByZip(val , this.state!== undefined ? this.state.stateCode : undefined,
                      this.city !== undefined ? this.city.cityCode : undefined,
                      this.county!== undefined ? this.county.countyCode : undefined)
                      .catch(res => {
                           return Observable.of([]);
                      })
                      .subscribe(
                          (data) => {
                            this.error.zip = '';
                            this.store.dispatch({ type: 'ZIP_CHANGE', value: data });

                        },
                        (error) => {
                           return error;
                     }
                    );
  }

  createStore(reducer, initialState) {
    let state = initialState ? initialState : {};
    let listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
      state = reducer(state, action);
      listeners.forEach(listener => listener();
    };

    const subscribe = (listener) => {
      if (typeof listener !== 'function') {
        throw new Error('Expected listener to be a function.')
      }
      listeners.push(listener);
      return {
        unsubscribe: (listener) => {
          listeners.filter(item => {
            if (item !== listener) {
              return item;
            }
          });
        }
      };
    };

    return { getState, dispatch, subscribe };
  }

}

export interface LocationGroupConfig {
  city?: LocationGroupAutocompleteConfig;
  state?: LocationGroupAutocompleteConfig;
  county?: LocationGroupAutocompleteConfig;
  country?: LocationGroupAutocompleteConfig;
  zip?: LocationGroupTextConfig;
}

export interface LocationGroupAutocompleteConfig {
  name: string;
  id: string;
  labelText: string;
  hint?: string;
  control?: any;
  required?: boolean;
  disabled?: boolean;
  allowAny?: boolean;
}

export interface LocationGroupTextConfig {

}

export interface LocationObject {
  city?: any;
  state?: any;
  county?: any;
  country?: any;
  zip?: any;
}
