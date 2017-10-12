import { Component, Input, forwardRef, ViewChild } from '@angular/core';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormControl, NG_VALIDATORS, AbstractControl, Validators
} from "@angular/forms";
import { LabelWrapper } from "sam-ui-kit/wrappers/label-wrapper";
import { OptionsType } from "sam-ui-kit/types";
import * as moment from "moment";
import { ValidationErrors } from '../../../app-utils/types';


/** Interfaces **/

// Represents a single fiscal year entry consisting of a year and a description
export interface FiscalYearEntry {
  year: number,
  description: string
}

// Represents the data that has been entered into a fy table form
export interface FiscalYearTableModel {
  isApplicable: boolean,

  // the entry that is currently being added or edited
  current: FiscalYearEntry,

  // the entries that have already been added
  entries: FiscalYearEntry[]
}

/* List of options accepted by fy table component
 * name: A non-empty name must be provided. Used to generate element ids
 * label: Heading to show above form
 * hint: Instructions for form
 * required: If true, will trigger validation errors if form is not filled out
 * errorMessage: If provided, will be used as validation error message
 * itemName: Column header to show in fy table above text entries
 * entry.hint: Instructions for adding an entry
 * textarea.required: Whether to show required tag on text area
 * select.required: Whether to show required tag on select dropdown
 * deleteModal: If defined and not null, shows a modal with specified title and description when deleting from table
 */
export interface FiscalYearTableConfig {
  name: string,
  label?: string,
  hint?: string,
  required?: boolean,
  errorMessage?: string,

  itemName: string,

  entry?: {
    hint?: string
  },

  textarea?: {
    required?: boolean
  },

  select?: {
    required?: boolean
  },

  deleteModal?: {
    title?: string,
    description?: string,
    flag?: string
  }
}


/** Component **/

@Component({
  selector: 'falFYTable',
  templateUrl: 'fiscal-year-table.template.html',
  providers: [
    // needed to use ControlValueAccessor implementation with form controls
    // see https://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FALFiscalYearTableComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FALFiscalYearTableComponent),
      multi: true
    }
  ]
})
export class FALFiscalYearTableComponent implements ControlValueAccessor {
  @Input() control: FormControl;

  // all parameters are passed in a single config object for convenience
  // see FiscalYearTableConfig interface for supported parameters
  @Input() config: FiscalYearTableConfig;

  // the model serves as the single source of truth for this component's data
  // whenever data is input or actions are taken that modify the form, the model should also be updated
  // the model is then used to render the table of entities and the checkbox
  private model: FiscalYearTableModel;

  // keeps track of what mode the component is in
  // when not in editing mode (default), shows the table of entries and an add new entry button
  // when in editing mode, the add new entry button is replaced with a new entry form, and table's action buttons are disabled
  public isEditing: boolean = false;

  // keeps track of the index that the next account will be added to on click of confirm button
  // when not in editing mode, index is set to the length of the entries list (adds on confirm)
  // when in editing mode, index is set to the index of the entry being edited (overwrites on confirm)
  public currentIndex: number = 0;

  // common component options
  public checkboxOptions: OptionsType[];
  public yearOptions: OptionsType[];

  // controls
  public fyTableGroup: FormGroup;
  public checkboxControl: FormControl;

  // label wrapper
  @ViewChild('fyTableWrapper') fyTableWrapper: LabelWrapper;

  // modals
  @ViewChild('deleteModal') deleteModal;


  /** Initial setup **/
  constructor() { }

  ngOnInit() {
    this.model = FALFiscalYearTableComponent.constructModelFrom(null); // set up initial empty model
    this.validateInputs();

    // set the possible options for checkbox and select dropdown components
    this.setYearOptions();
    this.setCheckboxOptions();

    this.createFormControls();
  }

  private setYearOptions() {
    let currentFY: number = this.getCurrentFY();
    this.yearOptions = [];

    this.addYearOption(currentFY - 1); // previous FY
    this.addYearOption(currentFY); // current FY
    this.addYearOption(currentFY + 1); // next FY
  }

  private setCheckboxOptions() {
    this.checkboxOptions = [
      { value: 'na', label: 'Not Applicable', name: this.config.name + '-checkbox-na' }
    ];
  }

  private validateInputs() {
    if(!(this.config && this.config.name)) {
      throw new Error("<falFYTable> requires a [name] parameter for 508 compliance");
    }
  }

  private createFormControls() {
    this.fyTableGroup = new FormGroup({
      textarea: new FormControl(''),
      year: new FormControl(null)
    });

    this.checkboxControl = new FormControl([]);


    if(this.control) {
      this.control.statusChanges.subscribe(status => {
        this.fyTableWrapper.formatErrors(this.control);
      });
    }

    this.checkboxControl.valueChanges.subscribe(value => {
      this.model.isApplicable = value.indexOf('na') === -1;
      if(!this.model.isApplicable) {
        this.resetForm();
      }
      this.onChange();
    });

    this.fyTableGroup.get('textarea').setValidators(
      (control: AbstractControl): (ValidationErrors | null) => {
        let errors: ValidationErrors = Validators.required(control);

        if (errors) {
          return {
            requiredField: {
              message: this.config.itemName + ' is required'
            }
          }
        } else {
          return null;
        }
      }
    );

    this.fyTableGroup.get('year').setValidators(
      (control: AbstractControl): (ValidationErrors | null) => {
        if (!control.value) {
          return {
            requiredField: {
              message: 'Year is required'
            }
          }
        } else {
          return null;
        }
      }
    );

    this.fyTableGroup.get('textarea').valueChanges.subscribe(value => {
      this.model.current.description = value;
      this.onChange();
    });

    this.fyTableGroup.get('year').valueChanges.subscribe((value: string) => {
      this.model.current.year = value == null ? null : +value;
      this.onChange();
    });
  }


  /** FY entry operations (add, remove, edit) **/

  public addEntry() {
    let fyEntry: FiscalYearEntry = {
      year: this.model.current.year,
      description: this.model.current.description
    };

    this.model.entries[this.currentIndex] = fyEntry;

    // Todo: Check whether we should be keeping the table sorted
    // after adding an entry the table may be out of order so sort it
    this.model.entries.sort((a, b) => {
      return a.year - b.year;
    });

    this.removeYearOption(this.model.current.year); // each year can only be selected once
    this.resetForm(); // after adding, close the form
    this.onChange();
  }

  public editEntry(index: number) {
    let entry = this.model.entries[index];
    this.addYearOption(entry.year); // add the entry's year back as an option, in case they change to another one

    this.fyTableGroup.get('textarea').setValue(entry.description || '');
    this.fyTableGroup.get('textarea').markAsDirty({onlySelf: true});
    this.fyTableGroup.get('year').setValue(entry.year);
    this.fyTableGroup.get('year').markAsDirty({onlySelf: true});

    this.currentIndex = index;
    this.isEditing = true;

    this.onChange();
  }

  public removeEntry(index: number) {
    this.addYearOption(this.model.entries[index].year); // the removed entry's year is freed up to be selected again

    this.model.entries.splice(index, 1); // remove the entry

    if(index === this.currentIndex) { // if the account currently being edited was removed
      // then we need to clear out the form and stop editing
      this.resetForm();
    } else if(index < this.currentIndex) { // else if an earlier entry was removed
      // then the index of currently edited entry has shifted down by 1
      this.currentIndex--;
    }

    this.onChange();
  }


  /** Event handlers **/

  // Handles component level functionality that should be run on every change
  private onChange() {
    this.onChangeCallback(this.model);
  }

  // On click of delete button in table
  public onDeleteClick(index: number) {
    let msg = '';
    if(this.deleteModal) {// if delete modal exists, show it
      msg = this.config.deleteModal.flag === 'ov' ? ' examples of funded projects.' : ' program accomplishments.';
        if(this.model.entries[index].year !== null) {
          this.config.deleteModal.description = 'Please confirm that you want to delete FY ' +this.model.entries[index].year.toString(10) + msg;
        }
        else
          this.config.deleteModal.description = 'Please confirm that you want to delete ' + msg;


      this.deleteModal.openModal(index);
    } else { // else just remove directly
      this.removeEntry(index);
    }
  }

  // On confirm of delete modal
  public onDeleteModalSubmit(index: any[]) {
    this.deleteModal.closeModal();
    this.removeEntry(index[0]);
  }


  /** Utility functions **/

  // Creates a standardized FiscalYearTableModel from an <any> object
  // Any missing properties will be assigned a default value
  public static constructModelFrom(obj: any): FiscalYearTableModel {
    let model: any = obj || {};

    if(model.isApplicable == null) {
      model.isApplicable = true;
    }

    model.current = model.current || {};
    model.current.year = model.current.year || null;
    model.current.description = model.current.description || null;

    model.entries = model.entries || [];

    for(let entry of model.entries) {
      entry.year = entry.year || null;
      entry.description = entry.description || null;
    }

    return model;
  }

  public getCurrentFY(): number {
    // fiscal year changes on start of Q4
    return moment().quarter() === 4 ? moment().add('year', 1).year() : moment().year()
  }

  public displayForm() {
    this.isEditing = true;
  }

  public resetForm() {
    if(this.currentIndex !== this.model.entries.length) { // if currently editing an entry, any changes will be canceled
      this.removeYearOption(this.model.current.year); // so remove its year from the pool of available options
    }

    this.fyTableGroup.reset({ textarea: '' }, {emitEvent: false});
    this.model.current.year = null;
    this.model.current.description = null;

    this.currentIndex = this.model.entries.length;
    this.isEditing = false;

    this.onChange();
  }

  private addYearOption(year: number) {
    if(year !== null) {
      this.yearOptions.push({value: year, label: year.toString(), name: this.config.name + '-year' + year});

      // after adding a year option the selections may be out of order so sort them
      this.yearOptions.sort((a, b) => {
        // value has type number | string, so if it is a string then parse it to a number
        let aValue: number = typeof a.value === 'number' ? a.value as number : parseInt(a.value as string, 10);
        let bValue: number = typeof b.value === 'number' ? b.value as number : parseInt(b.value as string, 10);

        return aValue - bValue;
      });
    }
  }

  private removeYearOption(year: number) {
    for(let i = 0; i < this.yearOptions.length; ++i) {
      if(this.yearOptions[i].value === year) {
        this.yearOptions.splice(i, 1);
      }
    }
  }

  // returns whether model contains at least one entry that should be displayed
  // entries that are displayed are those with no year or a year within the current 3 year range
  public containsDisplayedEntries() {
    return this.model.entries.filter(entry => {
      return entry.year === null || (entry.year >= this.getCurrentFY() - 1 && entry.year <= this.getCurrentFY() + 1);
    }).length > 0;
  }

  /** Validation **/

  public validate(c: AbstractControl): ValidationErrors {
    let error: ValidationErrors = {
      atLeastOneEntry: {
        message: this.config.errorMessage ? this.config.errorMessage : 'At least one ' + this.config.itemName + ' is required.'
      }
    };

    if (this.config && this.config.required === true) {
      if (this.model.isApplicable === true) {
        let fy: number = moment().quarter() === 4 ? moment().add('year', 1).year() : moment().year();
        // Only take into account the previous, current, and budget fiscal years
        let applicable = this.model.entries.filter((entry) => {
          let year: number = entry.year;
          return (year >= fy - 1) && (year <= fy + 1);
        });

        if (applicable.length === 0) {
          return error;
        }
      }
    }

    return null;
  }

  /** Implement ControlValueAccessor interface **/

  private onChangeCallback: any = (_: any) => {};
  private onTouchedCallback: any = () => {};

  public registerOnChange(fn: any) : void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any) : void {
    this.onTouchedCallback = fn;
  }

  public writeValue(obj: any) : void {
    this.model = FALFiscalYearTableComponent.constructModelFrom(obj);

    this.setYearOptions();
    for(let entry of this.model.entries) {
      this.removeYearOption(entry.year)
    }
    this.currentIndex = this.model.entries.length;

    this.checkboxControl.setValue(this.model.isApplicable ? [] : ['na'], { emitEvent: false });
    this.fyTableGroup.get('textarea').setValue(this.model.current.description || '', { emitEvent: false });
    this.fyTableGroup.get('year').setValue(this.model.current.year, { emitEvent: false });
  }

  public setDisabledState(isDisabled: boolean) : void {
    // todo ...
  }
}
