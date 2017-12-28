import {Component, EventEmitter, Output, ViewChild, Input} from '@angular/core';
import {SortArrayOfObjects} from "../../app-pipes/sort-array-object.pipe";

@Component({
  selector: 'sam-naics-psc-filter',
  templateUrl: 'naics-psc-filter.template.html'
})
export class SamNaicsPscFilter {

  /**********************************************************************
   * PSC Related Inputs/Outputs                                         *
   **********************************************************************/

  /**
   * String of comma separated psc values
   */
  @Input() pscValues: string = '';

  /**
   * EventEmitter for pscValues
   */
  @Output() pscValuesChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Array of psc objects to be used with autocomplete input
   */
  @Input() pscOptions: Array<any> = [];

  /**
   * Configuration object for psc to be used with autocomplete input
   */
  @Input() pscConfig: any;

  /**********************************************************************
   * NAICS Related Inputs/Outputs                                       *
   **********************************************************************/

  /**
   * String of comma separated naics values
   */
  @Input() naicsValues: string = '';

  /**
   * EventEmitter for naicsValues
   */
  @Output() naicsValuesChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Array of naics objects to be used with autocomplete input
   */
  @Input() naicsOptions: Array<any> = [];

  /**
   * COnfiguration object for naics to be used with autocomplete input
   */
  @Input() naicsConfig: any;

  private selectedNaicsOptions: Array<any> = [];
  private selectedPscOptions: Array<any> = [];

  constructor() {}

  ngOnChanges() {
    if (this.pscValues === '') {
      this.selectedPscOptions = [];
    } else if (this.pscValues !== '') {
      this.selectedPscOptions = this.getOptionsByValue(this.pscOptions,
                                                       this.pscValues.split(','),
                                                       this.pscConfig.config.keyValueConfig.keyProperty);
    }

    if (this.naicsValues === '') {
      this.selectedNaicsOptions = [];
    } else if (this.naicsValues !== '') {
      this.selectedNaicsOptions = this.getOptionsByValue(this.naicsOptions,
                                                         this.naicsValues.split(','),
                                                         this.naicsConfig.config.keyValueConfig.keyProperty);
    }
  }

  pscChanged(event) {
    // WARNING: Conditional is checking that options have been passed 
    // into the component from parent.
    // If this is removed, the search filter will ignore any search
    // parameters that were passed from the router and reset the search.
    if (this.pscOptions.length > 0) {
      this.selectedPscOptions = event;
      this.pscValues = this.getValuesFromOptions(this.selectedPscOptions,
                                                 this.pscConfig.config.keyValueConfig.keyProperty);
      this.pscValuesChange.emit(this.pscValues);
    }
  }

  naicsChanged(event) {
    // WARNING: Conditional is checking that options have been passed 
    // into the component from parent.
    // If this is removed, the search filter will ignore any search
    // parameters that were passed from the router and reset the search.
    if (this.naicsOptions.length > 0) {
      this.selectedNaicsOptions = event;
      this.naicsValues = this.getValuesFromOptions(this.selectedNaicsOptions,
                                                   this.naicsConfig.config.keyValueConfig.keyProperty);
      this.naicsValuesChange.emit(this.naicsValues);
    }
  }

  getValuesFromOptions(optionsArray: Array<any>, keyProperty: string): string {
    return optionsArray.map((option) => {
      if (option[keyProperty]) {
        return option[keyProperty];
      }
    }).join(',');
  }

  getOptionsByValue(optionsArray: Array<any>, filterStringsArray: Array<string>, keyProperty: string): Array<any> {
    return optionsArray.filter((option) => {
      if (filterStringsArray.length > 0) {
        for (let i = 0; i < filterStringsArray.length; i++) {
          if (option[keyProperty] === filterStringsArray[i]) {
            return option;
          }
        }
      }
    });
  }

}
