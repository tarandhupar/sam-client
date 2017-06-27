import { Component, EventEmitter, Output, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'sam-eligibility-filter',
  templateUrl: 'eligibility-filter.template.html'
})
export class SamEligibilityFilter {
  /**
   * A string of comma separated keys used to identify beneficiary objects
   * from the passed in options
   */
  @Input() beneficiaryValues: string;

  /**
   * A string of comma separated keys used to identify beneficiary objects
   * from the passed in options
   */
  @Input() applicantValues: string;

  /**
   * Event Emitter to push new beneficiaryValues when changed internally
   */
  @Output() beneficiaryValuesChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Event emitter to push new applicantValues when changed internally
   */
  @Output() applicantValuesChange: EventEmitter<any> = new EventEmitter<any>();


  /**
   * An array of beneficiary objects used by the autocomplete multiselect 
   * component to generate the list of options in the dropdown.
   */
  @Input() beneficiaryOptions: Array<any> = [];

  /**
   * An array of beneficiary objects used by the autocomplete multiselect 
   * component to generate the list of options in the dropdown.
   */
  @Input() applicantOptions: Array<any> = [];

  /**
   * Configuration object for beneficiary input
   */
  @Input() beneficiaryConfig: any;

  /**
   * Configuration object for applicant input
   */
  @Input() applicantConfig: any;

  private selectedBeneficiaryOptions: Array<any> = [];
  private selectedApplicantOptions: Array<any> = [];

  constructor() { }

  ngOnChanges() {
    if (this.beneficiaryValues === '') {
      this.selectedBeneficiaryOptions = [];
    } else if (this.beneficiaryValues !== '') {
      this.selectedBeneficiaryOptions = this.getOptionByValue(this.beneficiaryOptions,
                                                              this.beneficiaryValues.split(','),
                                                              this.beneficiaryConfig.config.keyValueConfig.keyProperty);
    }

    if (this.applicantValues === '') {
      this.selectedApplicantOptions = [];
    } else if (this.applicantValues !== '') {
      this.selectedApplicantOptions = this.getOptionByValue(this.applicantOptions,
                                                              this.applicantValues.split(','),
                                                              this.applicantConfig.config.keyValueConfig.keyProperty);
    }
  }

  beneficiaryChanged(event) {
    // WARNING: Conditional is checking that options have been passed 
    // into the component from parent.
    // If this is removed, the search filter will ignore any search
    // parameters that were passed from the router and reset the search.
    if (this.beneficiaryOptions.length > 0) {
      this.selectedBeneficiaryOptions = event;
      this.beneficiaryValues = this.getValuesFromOptions(this.selectedBeneficiaryOptions,
                                                        this.beneficiaryConfig.config.keyValueConfig.keyProperty);
      this.beneficiaryValuesChange.emit(this.beneficiaryValues);
    }
  }

  applicantChanged(event) {
    // WARNING: Conditional is checking that options have been passed 
    // into the component from parent.
    // If this is removed, the search filter will ignore any search
    // parameters that were passed from the router and reset the search.
    if (this.applicantOptions.length > 0) {
      this.selectedApplicantOptions = event;
      this.applicantValues = this.getValuesFromOptions(this.selectedApplicantOptions,
                                                        this.applicantConfig.config.keyValueConfig.keyProperty);
      this.applicantValuesChange.emit(this.applicantValues);
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


