import {Component, EventEmitter, Output, ViewChild, Input} from '@angular/core';

@Component({
  selector: 'search-multi-select-filter',
  templateUrl: 'search-multi-select-filter.template.html'
})
export class SearchMultiSelectFilter {

  /**
   * A string of comma separated keys used to identify beneficiary objects
   * from the passed in options
   */
  @Input() selectValues: string;

  /**
   * Event Emitter to push new beneficiaryValues when changed internally
   */
  @Output() selectValuesChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * An array of beneficiary objects used by the autocomplete multiselect
   * component to generate the list of options in the dropdown.
   */
  @Input() selectOptions: Array<any> = [];

  /**
   * Configuration object for beneficiary input
   */
  @Input() selectConfig: any;

  private selectedOptions: Array<any> = [];

  constructor(){}

  ngOnChanges() {
    if (this.selectValues === '') {
      this.selectedOptions = [];
    } else if (this.selectValues !== '') {
      this.selectedOptions = this.getOptionByValue(this.selectOptions,
        this.selectValues.split(','),
        this.selectConfig.config.keyValueConfig.keyProperty);
    }
  }

  selectChanged(event) {
    if (this.selectOptions.length > 0) {
      this.selectedOptions = event;
      this.selectValues = this.getValuesFromOptions(this.selectedOptions,
        this.selectConfig.config.keyValueConfig.keyProperty);
      this.selectValuesChange.emit(this.selectValues);
    }
  }

  getValuesFromOptions(optionsArray: Array<any>, keyProperty: string): string {
    return optionsArray.map((option) => {
      if (option[keyProperty]) {
        return option[keyProperty];
      }
    }).join(',');
  }

  getOptionByValue(optionsArray: Array<any>, filterStringsArray: Array<string>, keyProperty: string): Array<any> {
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
