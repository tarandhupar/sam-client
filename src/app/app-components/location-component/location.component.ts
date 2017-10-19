import { Component, Input, Output, OnInit, OnChanges, OnDestroy, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AutocompleteConfig } from '../../../sam-ui-elements/src/ui-kit/types';


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

  constructor() {}

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
    return this.location.zip;
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
        labelText: "State"
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
                city: state.cityConfig && action.value ? action.value : undefined,
                county: state.cityConfig && action.value ?  state.location.county : undefined,
                state: state.stateConfig && action.value && action.value.state ?
                        { key: action.value.state.stateCode,
                          value: action.value.state.stateCode + " - " + action.value.state.state } :
                        state.location.state,

                zip: undefined,
                country: state.countryConfig && action.value && action.value.state && action.value.state.country ?
                          { key: action.value.state.country.countrycode,
                            value: action.value.state.country.country } :
                          state.location.country,

              }
            )
          }
        );
       case "COUNTY_CHANGE":
          // When county changes,
          // clear city and zip as these are many-to-many relationships.
          // Then populate state and country since they are parent properties
        return Object.assign(
          {},
          state,
          {
            location: Object.assign(
              {},
              state.location,
              {
                city: state.countyConfig && action.value ? state.location.city :undefined,
                county: state.countyConfig && action.value ? action.value : undefined,
                state: state.stateConfig && action.value && action.value.state ?
                        { key: action.value.state.stateCode,
                          value: action.value.state.stateCode + " - " + action.value.state.state } :
                        state.location.state,
                zip: '', // Zip is text field. Set to emptry string.
                country: state.countryConfig && action.value && action.value.state && action.value.state.country ?
                          { key: action.value.state.country.countrycode,
                            value: action.value.state.country.country } : // Provide values later
                          state.location.country

              }
            )
          }
      );
      case "STATE_CHANGE":
        /**
         * When state changes,
         * clear city, county and zip.
         * Populate country.
         */
        return Object.assign(
            {},
            state,
            {
              location: Object.assign(
                {},
                state.location,
                {
                  city: undefined,
                  county: '',
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
      case "COUNTRY_CHANGE":
        /**
         * When country changes, clear all other fields.
         */
        return Object.assign(
          {},
          state,
          {
            location: Object.assign(
              {},
              state.location,
              {
                city: undefined,
                county: undefined,
                state: undefined,
                zip: '',
                country: state.countryConfig && action.value ? action.value : undefined
              }
            )
          }
        );
      case "ZIP_CHANGE":
        return Object.assign(
          {},
          state,
          {
            location: Object.assign(
              {},
              state.location,
              {
                city: undefined,
                county: undefined,
                state: state.stateConfig && action.value && action.value.state ?
                        { key: action.value.state.stateCode,
                          value: action.value.state.state } :
                        state.location.state,
                zip: state.zipConfig ? action.value : '',
                country: state.countryConfig && action.value && action.value.state && action.value.state.country ?
                          { key: action.value.state.country.countrycode,
                            value: action.value.state.country.country } :
                          state.location.country
              }
            )
          }
        );
      default:
        return state;
    }
  }

  createStore(reducer, initialState) {
    let state = initialState ? initialState : {};
    let listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
      state = reducer(state, action);
      listeners.forEach(listener => listener());
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
