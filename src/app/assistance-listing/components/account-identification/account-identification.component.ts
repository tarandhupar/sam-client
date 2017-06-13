import { Component, Input, ViewChild, forwardRef } from "@angular/core";
import {
  ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, FormGroup, Validators,
  AbstractControl, NG_VALIDATORS, Validator
} from "@angular/forms";
import { LabelWrapper } from "sam-ui-kit/wrappers/label-wrapper";
import { ValidationErrors } from "../../../app-utils/types";


/** Interfaces **/

// Represents a single account identification with an account code and description
export interface AccountIdentification {
  code: string,
  description: string
}

// Represents all the data that has been entered into an account identification form
export interface AccountIdentificationModel {
  // the account that is currently being added or edited
  codeParts: string[], // each part of account code is input in its own textbox
  description: string,

  // the accounts that have already been added
  accounts: AccountIdentification[]
}

/* List of options accepted by account identification component
 * name: A non-empty name must be provided. Used to generate element ids
 * label: Heading to show above form
 * hint: Instructions for form
 * codeHint: Instructions for account code subform
 * required: If true, will trigger validation errors if form is not filled out
 * deleteModal: If defined and not null, shows a modal with specified title and description when deleting from table
 */
export interface AccountIdentificationConfig {
  name: string,
  label?: string,
  hint?: string,
  codeHint?: string,
  required?: boolean,

  deleteModal?: {
    title?: string,
    description?: string
  }
}


/** Component **/

/*
 * This component consists of a table displaying a list of accounts,
 * and functionality for adding, removing, or editing them.
 *
 * Adding and editing accounts is done through a form that consists of
 * several account code parts and a description. Some basic validations are implemented.
 */
@Component({
  selector: 'falAccountIdentificationInput',
  templateUrl: 'account-identification.template.html',
  providers: [
    // needed to use ControlValueAccessor implementation with form controls
    // see https://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FALAccountIdentificationComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FALAccountIdentificationComponent),
      multi: true
    }
  ]
})
export class FALAccountIdentificationComponent implements ControlValueAccessor, Validator {
  // all parameters are passed in a single config object for convenience
  // see AccountIdentificationConfig interface for supported parameters
  @Input() config: AccountIdentificationConfig;
  @Input() control: FormControl;

  // the model serves as the single source of truth for this component's data
  // whenever data is input or actions are taken that modify the form, the model should also be updated
  // the model is then used to render the table of accounts
  public model: AccountIdentificationModel;

  // keeps track of what mode the component is in
  // when not in editing mode (default), shows the table of accounts and an add new account button
  // when in editing mode, the add new account button is replaced with a new account form, and table's action buttons are disabled
  public isEditing: boolean = false;

  // keeps track of the index that the next account will be added to on click of confirm button
  // when not in editing mode, index is set to the length of the accounts list (adds on confirm)
  // when in editing mode, index is set to the index of the entry being edited (overwrites on confirm)
  private currentIndex: number = 0;

  // the maximum characters that can be input for each part of an account code
  public codePartLengths: number[] = [2, 4, 1, 1, 3];

  // controls
  public accountForm: FormGroup;
  public codeForm: FormGroup;
  public descriptionControl: FormControl;

  // label wrappers
  @ViewChild('accountIdentificationLabel') wrapper: LabelWrapper;
  @ViewChild('codeLabel') codeWrapper: LabelWrapper;

  // modals
  @ViewChild('deleteModal') deleteModal;


  /** Initial setup **/
  constructor() {
  }

  ngOnInit() {
    this.model = FALAccountIdentificationComponent.constructModelFrom(null); // set up initial empty model
    this.validateInputs();
    this.createFormControls();
  }

  private validateInputs() {
    if (!(this.config && this.config.name)) {
      throw new Error("<falAccountIdentificationInput> requires a [name] parameter for 508 compliance");
    }
  }

  private createFormControls() {
    this.accountForm = new FormGroup({});
    this.codeForm = new FormGroup({});
    this.accountForm.addControl('codeParts', this.codeForm);

    if (this.control) {
      this.control.statusChanges.subscribe(status => {
        this.wrapper.formatErrors(this.control);
      });
    }

    for (let i = 0; i < this.codePartLengths.length; i++) {
      // code parts are required and should only take numbers
      let codePartControl = new FormControl(null, [Validators.required, Validators.pattern('[0-9]*')]);
      codePartControl.valueChanges.subscribe(value => {
        this.model.codeParts[i] = value;
        this.onChange();
      });

      this.codeForm.addControl('codePart' + i, codePartControl);
    }

    this.descriptionControl = new FormControl();
    this.descriptionControl.valueChanges.subscribe(value => {
      this.model.description = value;
      this.onChange();
    });
    this.accountForm.addControl('description', this.descriptionControl);
  }


  /** Account operations (add, remove, edit) **/

  public addAccount() {
    // When adding an account, combine each code part together by joining with dashes
    let combinedCode = '';
    for (let i = 0; i < this.codePartLengths.length; i++) {
      if (this.codeForm.get('codePart' + i).value) {
        combinedCode = combinedCode + '-' + this.codeForm.get('codePart' + i).value;
      }
    }

    let account: AccountIdentification = {
      code: combinedCode.replace(/^-/, '') || null,
      description: this.descriptionControl.value
    };

    this.model.accounts[this.currentIndex] = account;
    this.resetForm(); // after adding, close the form
  }

  public removeAccount(index: number) {
    this.model.accounts.splice(index, 1); // remove the account

    if (index === this.currentIndex) { // if the account currently being edited was removed
      // then we need to clear out the form and stop editing
      this.resetForm();
    } else if (index < this.currentIndex) { // else if an earlier account was removed
      // then the index of the currently edited account has shifted down by 1
      this.currentIndex--;
    }

    this.onChange();
  }

  public editAccount(index: number) {
    // When editing an account, split its code up into parts
    let code = this.model.accounts[index].code;

    if (code) {
      let splits = code.split('-');
      for (let i = 0; i < this.codePartLengths.length; i++) {
        this.codeForm.get('codePart' + i).setValue(splits[i]);
      }
    }

    let description = this.model.accounts[index].description;
    this.descriptionControl.setValue(description);

    this.currentIndex = index;
    this.isEditing = true;
  }


  /** Event handlers **/

  // Modified version of code originally by Joseph Lennox
  // http://stackoverflow.com/a/15595732
  // todo: fix edge cases
  public onKeyup(event) {
    let target = event.srcElement || event.target;
    let maxLength = parseInt(target.attributes["maxlength"].value, 10);
    let currentLength = target.value.length;

    let node = target.parentNode.parentNode.parentNode.parentNode;

    // When typing into code part inputs, focus on the next or previous input automatically
    if (currentLength >= maxLength || currentLength === 0) {
      while (node != null) {
        if (currentLength >= maxLength) {
          node = node.nextElementSibling;
        } else if (currentLength === 0) {
          node = node.previousElementSibling;
        }

        if (node && node.tagName.toLowerCase() === "sam-text") {
          node.getElementsByTagName('input')[0].focus();
          break;
        }
      }
    }
  }

  // On click of delete button in table
  public onDeleteClick(index: number) {
    if (this.deleteModal) { // if delete modal exists, show it
      let code = '';
      let description = '';
      let msg ='Please confirm that you want to delete "';
      code = this.model.accounts[index].code;
      description = this.model.accounts[index].description ===null || this.model.accounts[index].description === "" ? null : this.model.accounts[index].description;
      if (code !== null && description !== null) {
        this.config.deleteModal.description = msg + code +'. ' +  description + '".';
      } else if(description !== null && code === null) {
        this.config.deleteModal.description = msg + description +'".';
      }  else if(description === null && code !== null) {
        this.config.deleteModal.description = msg + code + '".';
      } else {
        this.config.deleteModal.description = 'Please confirm that you want to delete account identification';
      }
      this.deleteModal.openModal(index);
    } else { // else just remove directly
      this.removeAccount(index);
    }
  }

  // On confirm of delete modal
  public onDeleteModalSubmit(index: any[]) {
    this.deleteModal.closeModal();
    this.removeAccount(index[0]);
  }

  // Handles component level functionality that should be run on every change, such as validations
  private onChange() {
    this.onChangeCallback(this.model);

    // todo: clean up code, fix validations
    let errored: AbstractControl = new FormControl();

    // todo: add check for whether user is editing
    for (let key in this.codeForm.controls) {
      if (this.codeForm.controls.hasOwnProperty(key)) {
        let control = this.codeForm.controls[key];
        if (control.invalid && control.errors) {
          errored = control;
          break;
        }
      }
    }

    // Magic happens here
    if (errored.pristine && !this.codeForm.pristine) {
      errored.markAsDirty({onlySelf: true});
      this.codeWrapper.formatErrors(errored);
      errored.markAsPristine({onlySelf: true});
    } else {
      this.codeWrapper.formatErrors(errored);
    }

    // todo: implement this in separate function
    // this.wrapper.formatErrors(this.accountFormGroup);
  }


  /** Utility functions **/

  // Creates a standardized AccountIdentificationModel from an <any> object
  // Any missing properties will be assigned a default value
  public static constructModelFrom(obj: any): AccountIdentificationModel {
    let model: any = obj || {};

    model.codeParts = model.codeParts || [];
    model.description = model.description || null;
    model.accounts = model.accounts || [];

    for (let part of model.codeParts) {
      part = part || null;
    }

    for (let account of model.accounts) {
      account.code = account.code || null;
      account.description = account.description || null;
    }

    return model;
  }

  public displayForm() {
    this.isEditing = true;
  }

  public resetForm() {
    this.accountForm.reset();
    this.currentIndex = this.model.accounts.length;
    this.isEditing = false;

    this.onChange();
  }


  /** Validation **/

  public validate(c: AbstractControl): ValidationErrors {
    let error: ValidationErrors = {
      atLeastOneAccount: {
        message: 'At least one account identification code is required.'
      }
    };

    if (this.config.required && this.config.required === true) {
      if (this.model.accounts.length === 0) {
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
    this.model = FALAccountIdentificationComponent.constructModelFrom(obj);
    this.currentIndex = this.model.accounts.length;
  }

  public setDisabledState(isDisabled: boolean): void {
    // todo...
  }
}
