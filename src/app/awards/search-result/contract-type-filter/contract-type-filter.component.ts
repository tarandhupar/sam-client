import {Component, EventEmitter, Output, ViewChild, Input} from '@angular/core';

@Component({
  selector: 'sam-contract-type-filter',
  templateUrl: 'contract-type-filter.template.html'
})
export class SamContractTypeFilter {

  /**
   * A string of comma separated keys used to identify beneficiary objects
   * from the passed in options
   */
  @Input() contractValues: string;

  /**
   * Event Emitter to push new beneficiaryValues when changed internally
   */
  @Output() contractValuesChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * An array of beneficiary objects used by the autocomplete multiselect
   * component to generate the list of options in the dropdown.
   */
  @Input() contractOptions: Array<any> = [];

  /**
   * Configuration object for beneficiary input
   */
  @Input() contractConfig: any;

  private selectedContractOptions: Array<any> = [];

  constructor(){}

  ngOnChanges() {
    if (this.contractValues === '') {
      this.selectedContractOptions = [];
    } else if (this.contractValues !== '') {
      this.selectedContractOptions = this.getOptionByValue(this.contractOptions,
        this.contractValues.split(','),
        this.contractConfig.config.keyValueConfig.keyProperty);
    }
  }

  contractChanged(event) {
    if (this.contractOptions.length > 0) {
      this.selectedContractOptions = event;
      this.contractValues = this.getValuesFromOptions(this.selectedContractOptions,
        this.contractConfig.config.keyValueConfig.keyProperty);
      this.contractValuesChange.emit(this.contractValues);
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
