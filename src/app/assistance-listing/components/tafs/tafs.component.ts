import { Component, Input, forwardRef, ViewChild } from "@angular/core";
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormControl, Validators,
  NG_VALIDATORS, Validator, AbstractControl
} from "@angular/forms";
import { LabelWrapper } from "sam-ui-kit/wrappers/label-wrapper";
import { ValidationErrors } from "../../../app-utils/types";


/** Interfaces **/

// Represents a single treasury appropriation fund symbol (TAFS)
export interface TAFS {
  departmentCode: string,
  accountCode: string,
  subAccountCode: string,
  allocationTransferAgency: string,
  fy1: string,
  fy2: string
}

// Represents all the data that has been entered into a tafs form
export interface TAFSModel extends TAFS {
  current: TAFS, // the tafs that is currently being added or edited
  tafs: TAFS[] // the tafs that have already been entered
}

/* List of options accepted by tafs component
 * name: A non-empty name must be provided. Used to generate element ids
 * label: Heading to show above form
 * hint: Instructions for form
 * required: If true, will trigger validation errors if form is not filled out
 * deleteModal: If defined and not null, shows a modal with specified title and description when deleting from table
 */
export interface TAFSConfig {
  name: string,
  label?: string,
  hint?: string,
  required?: boolean,

  deleteModal?: {
    title?: string,
    description?: string
  }
}


/** Component **/

/*
 * This component consists of a table displaying a list of tafs,
 * and functionality for adding, removing, or editing them.
 *
 * Adding and editing tafs is done through a form that consists of text inputs.
 */
@Component({
  selector: 'falTAFSInput',
  templateUrl: 'tafs.template.html',
  providers: [
    // needed to use ControlValueAccessor implementation with form controls
    // see https://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FALTafsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FALTafsComponent),
      multi: true
    }
  ]
})
export class FALTafsComponent implements ControlValueAccessor, Validator {
  // all parameters are passed in a single config object for convenience
  // see TAFSConfig interface for supported parameters
  @Input() config: TAFSConfig;
  @Input() control: FormControl;

  // the model serves as the single source of truth for this component's data
  // whenever data is input or actions are taken that modify the form, the model should also be updated
  // the model is then used to render the table of tafs
  public model: TAFSModel;

  // keeps track of what mode the component is in
  // when not in editing mode (default), shows the table of tafs and an add new tafs button
  // when in editing mode, the add new tafs button is replaced with a new tafs form, and table's action buttons are disabled
  public isEditing: boolean = false;

  // keeps track of the index that the next account will be added to on click of confirm button
  // when not in editing mode, index is set to the length of the tafs list (adds on confirm)
  // when in editing mode, index is set to the index of the entry being edited (overwrites on confirm)
  private currentIndex: number = 0;

  // controls
  public tafsForm: FormGroup;

  // label wrappers
  @ViewChild('tafsLabel') tafsWrapper: LabelWrapper;

  // modals
  @ViewChild('deleteModal') deleteModal;


  /** Initial setup **/

  constructor() {
  }

  ngOnInit() {
    this.model = FALTafsComponent.constructModelFrom(null); // set up initial empty model
    this.validateInputs();
    this.createFormControls();
  }

  private validateInputs() {
    if (!(this.config && this.config.name)) {
      throw new Error("<falTAFSInput> requires a [name] parameter for 508 compliance");
    }
  }

  private createFormControls() {
    // all tafs fields take only numbers
    this.tafsForm = new FormGroup({
      departmentCode: new FormControl(null, Validators.pattern('[0-9]*')),
      accountCode: new FormControl(null, Validators.pattern('[0-9]*')),
      subAccountCode: new FormControl(null, Validators.pattern('[0-9]*')),
      allocationTransferAgency: new FormControl(null, Validators.pattern('[0-9]*')),
      fy1: new FormControl(null, Validators.pattern('[0-9]*')),
      fy2: new FormControl(null, Validators.pattern('[0-9]*'))
    });

    if(this.control) {
      this.control.statusChanges.subscribe(status => {
        this.tafsWrapper.formatErrors(this.control);
      });
    }

    this.tafsForm.get('departmentCode').valueChanges.subscribe(value => {
      this.model.current.departmentCode = value;
      this.onChange();
    });

    this.tafsForm.get('accountCode').valueChanges.subscribe(value => {
      this.model.current.accountCode = value;
      this.onChange();
    });

    this.tafsForm.get('subAccountCode').valueChanges.subscribe(value => {
      this.model.current.subAccountCode = value;
      this.onChange();
    });

    this.tafsForm.get('allocationTransferAgency').valueChanges.subscribe(value => {
      this.model.current.allocationTransferAgency = value;
      this.onChange();
    });

    this.tafsForm.get('fy1').valueChanges.subscribe(value => {
      this.model.current.fy1 = value;
      this.onChange();
    });

    this.tafsForm.get('fy2').valueChanges.subscribe(value => {
      this.model.current.fy2 = value;
      this.onChange();
    });
  }


  /** TAFS operations (add, remove, edit) **/

  public addTafs() {
    this.model.tafs[this.currentIndex] = {
      departmentCode: this.model.current.departmentCode,
      accountCode: this.model.current.accountCode,
      subAccountCode: this.model.current.subAccountCode,
      allocationTransferAgency: this.model.current.allocationTransferAgency,
      fy1: this.model.current.fy1,
      fy2: this.model.current.fy2
    };

    this.resetForm(); // after adding, close the form
  }

  public removeTafs(index: number) {
    this.model.tafs.splice(index, 1); // remove the tafs

    if (index === this.currentIndex) { // if the tafs currently being edited was removed
      // then we need to clear out the form and stop editing
      this.tafsForm.reset();
    } else if (index < this.currentIndex) { // else if an earlier tafs was removed
      // then the index of the currently edited tafs has shifted down by one
      this.currentIndex--;
    }

    this.onChange();
  }

  public editTafs(index: number) {
    let tafs = this.model.tafs[index];

    this.tafsForm.get('departmentCode').setValue(tafs.departmentCode);
    this.tafsForm.get('accountCode').setValue(tafs.accountCode);
    this.tafsForm.get('subAccountCode').setValue(tafs.subAccountCode);
    this.tafsForm.get('allocationTransferAgency').setValue(tafs.allocationTransferAgency);
    this.tafsForm.get('fy1').setValue(tafs.fy1);
    this.tafsForm.get('fy2').setValue(tafs.fy2);

    this.currentIndex = index;
    this.isEditing = true;
  }


  /** Event handlers **/

  // Handles component level functionality that should be run on every change, such as validations
  private onChange() {
    // todo: validations
    this.onChangeCallback(this.model);
  }

  // On click of delete button in table
  public onDeleteClick(index: number) {
    let departmentCode = '';
    let accountCode = '';
    let msg = 'Please confirm that you want to delete this TAFS ';
    if (this.deleteModal) { // if delete modal exists, show it
      departmentCode = this.model.tafs[index].departmentCode;
      accountCode = this.model.tafs[index].accountCode;
      if (departmentCode !== null && accountCode !== null) {
        this.config.deleteModal.description = msg + ' (Treasury Dept. Code ' + departmentCode + '. Treasury Account Main Code ' + accountCode + ').';
      } else if(departmentCode !== null && accountCode === null) {
        this.config.deleteModal.description = msg + ' (Treasury Dept. Code ' + departmentCode + ').';
      } else if(departmentCode === null && accountCode !== null) {
        this.config.deleteModal.description = msg + ' (Treasury Account Main Code ' + accountCode + ').';
      }
      else
        this.config.deleteModal.description = 'Please confirm that you want to delete TAFS.';
      this.deleteModal.openModal(index);
    } else { // else just remove directly
      this.removeTafs(index);
    }
  }

  // On confirm of delete modal
  public onDeleteModalSubmit(index: any[]) {
    this.deleteModal.closeModal();
    this.removeTafs(index[0]);
  }


  /** Utility functions **/

  // Creates a standardized TAFSModel from an <any> object
  // Any missing properties will be assigned a default value
  private static constructModelFrom(obj: any): TAFSModel {
    let model: any = obj || {};

    model.tafs = model.tafs || [];

    for (let tafs of model.tafs) {
      tafs.departmentCode = tafs.departmentCode || null;
      tafs.accountCode = tafs.accountCode || null;
      tafs.subAccountCode = tafs.subAccountCode || null;
      tafs.allocationTransferAgency = tafs.allocationTransferAgency || null;
      tafs.fy1 = tafs.fy1 || null;
      tafs.fy2 = tafs.fy2 || null;
    }

    model.current = model.current || {};
    model.current.departmentCode = model.current.departmentCode || null;
    model.current.accountCode = model.current.accountCode || null;
    model.current.subAccountCode = model.current.subAccountCode || null;
    model.current.allocationTransferAgency = model.current.allocationTransferAgency || null;
    model.current.fy1 = model.current.fy1 || null;
    model.current.fy2 = model.current.fy2 || null;

    return model;
  }

  public displayForm() {
    this.isEditing = true;
  }

  public resetForm() {
    this.tafsForm.reset();
    this.currentIndex = this.model.tafs.length;
    this.isEditing = false;

    this.onChange();
  }


  /** Validation **/

  public validate(c: AbstractControl): ValidationErrors {
    let error: ValidationErrors = {
      atLeastOneEntry: {
        message: 'At least one TAFs code is required.'
      }
    };

    if (this.config.required && this.config.required === true) {
      if (this.model.tafs.length === 0) {
        return error;
      }
    }

    return null;
  }


  /** Implement ControlValueAccessor interface **/

  private onChangeCallback: any = (_: any) => {
  };
  private onTouchedCallback: any = () => {
  };

  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public writeValue(obj: any): void {
    this.model = FALTafsComponent.constructModelFrom(obj);
    this.currentIndex = this.model.tafs.length;
  }

  public setDisabledState(isDisabled: boolean): void {
    // todo...
  }
}
