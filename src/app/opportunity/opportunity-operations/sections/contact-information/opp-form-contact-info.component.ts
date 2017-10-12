import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { OpportunityFormViewModel } from '../../framework/data-model/opportunity-form/opportunity-form.model';
import { OppContactInfoViewModel } from '../../framework/data-model/sections/contact-information/contact-information.model';

@Component({
  providers: [],
  templateUrl: 'opp-form-contact-info.template.html',
  selector: 'opp-form-contact-info'
})
export class OpportunityContactInfoComponent implements OnInit {
  @Input() viewModel: OpportunityFormViewModel;
  public oppContactInfoViewModel: OppContactInfoViewModel;

  public oppContactInfoForm: FormGroup;
  public primaryPOC: FormControl;
  public secondaryPOC: FormControl;

  // keeps track of current form state
  public primaryPOCState: string = 'start';
  public secondaryPOCState: string = 'start';

  public readonly pocConfig = {
    // common configuration for all poc
    addButtonType: 'secondary',
    showModalOnDelete: true,

    pocEntry: {
      manualList: true,
      showAddress: false,
    },

    listbuilder: {
      disableActions: false,
      hideDefaultButtons: true,
      sortable: false,
    },

    // configuration for primary poc
    primary: {
      type: 'primary',
      id: 'opp-primary-poc',
      label: 'Primary Point of Contact',
      hint: 'You are required to add at least one entry for this field.',
      required: true,
      addButtonText: 'Add Primary Contact',
      deleteModalConfig: {
        title: 'Delete Primary Point of Contact',
        type: 'warning',
        description: 'Please confirm that you want to delete the contact.',
      },
    },

    // configuration for secondary poc
    secondary: {
      type: 'secondary',
      id: 'opp-secondary-poc',
      label: 'Secondary Point of Contact',
      hint: 'Optionally select a secondary point of contact.',
      required: false,
      addButtonText: 'Add Secondary Contact',
      deleteModalConfig: {
        title: 'Delete Secondary Point of Contact',
        type: 'warning',
        description: 'Please confirm that you want to delete the contact.',
      },
    },
  };

  // template used to initialize a poc entry when add button is clicked
  private readonly pocFormTemplate = {
    contactId: 'na',
    title: null,
    fullName: null,
    email: null,
    phone: null,
    fax: null,
  };

  constructor(private fb: FormBuilder) {
    Object.freeze(this.pocConfig);
    Object.freeze(this.pocFormTemplate);
  }

  ngOnInit() {
    this.oppContactInfoViewModel = this.viewModel.oppContactInfoViewModel;

    this.createForm();
    if (!this.viewModel.isNew) {
      this.updateForm();
    }

    this.oppContactInfoForm.valueChanges.subscribe(value => {
      this.savePOC();
    });
  }

  private createForm(): void {
    this.primaryPOC = new FormControl();
    this.secondaryPOC = new FormControl();

    this.oppContactInfoForm = this.fb.group({
      primaryPOC: this.primaryPOC,
      secondaryPOC: this.secondaryPOC,
    });
  }

  private updateForm(): void {
    this.oppContactInfoForm.setValue({
      primaryPOC: this.loadPOC(this.pocConfig.primary.type),
      secondaryPOC: this.loadPOC(this.pocConfig.secondary.type),
    }, {
      emitEvent: false,
    });

    // update form state to display the loaded data
    if (this.primaryPOC.value != null) {
      this.onContactAction(this.pocConfig.primary.type, 'load');
    }

    if (this.secondaryPOC.value != null) {
      this.onContactAction(this.pocConfig.secondary.type, 'load');
    }
  }

  /**
   * Based on a poc form's name, return a reference to its form control and state.
   *
   * The returned state reference is actually a wrapper with get() and set() methods.
   * Since javascript does not support passing primitives by reference, and the state is a primitive,
   * the wrapper object is a workaround to be able to mutate the state.
   **/
  private getReferencesByName(name: string): [FormControl, {get: Function, set: Function}] {
    let control;
    let state;

    if (name === this.pocConfig.primary.type) {
      control = this.primaryPOC;
      state = {
        get: () => { return this.primaryPOCState },
        set: newState => { this.primaryPOCState = newState },
      };
    } else if (name === this.pocConfig.secondary.type) {
      control = this.secondaryPOC;
      state = {
        get: () => { return this.secondaryPOCState },
        set: newState => { this.secondaryPOCState = newState },
      };
    } else {
      console.error('Unknown point of contact name: ', name);
      return;
    }

    return [control, state];
  }

  // check whether a poc form is currently in the specified state
  public pocStateEquals(name: string, state: string): boolean {
    let [_, currentState] = this.getReferencesByName(name);
    return currentState.get() === state;
  }

  /**
   * The poc form behaves as a deterministic finite state machine.
   *
   * It has possible states Q = {'start', 'add', 'edit', 'display'} and begins in state q0 = 'start'.
   * The behaviour and appearance of the form will change depending on the current state.
   *   start:     shows a button to add a new poc
   *   add:       shows poc entry form
   *   edit:      shows poc entry form with any entered data pre-populated
   *   display:   shows currently entered poc data
   *
   * The alphabet is Σ = {'add', 'edit', 'load', 'submit', 'cancel', 'delete'}.
   * These symbols correspond to actions on the form which are all processed in onContactAction() regardless of source.
   *   add:       add button is clicked (via sam-button)
   *   edit:      edit button is clicked (via sam-listbuilder-card)
   *   load:      poc data from api is loaded into the form
   *   submit:    submit button is clicked (via sam-poc-entry)
   *   cancel:    cancel button is clicked (via sam-poc-entry)
   *   delete:    delete button is clicked (via sam-listbuilder-card)
   *
   * The transition function is characterized by the below switch statement.
   **/
  public onContactAction(name: string, action: any): void {
    let [control, state] = this.getReferencesByName(name);

    switch (action) {
      case 'add':
        control.setValue(_.cloneDeep(this.pocFormTemplate), {emitEvent: false});
        state.set('add');
        break;

      case 'edit':
        control.setValue(control.value);
        state.set('edit');
        break;

      case 'load':
      case 'submit':
        state.set('display');
        break;

      case 'cancel':
        state.set(state.get() === 'add' ? 'start' : 'display');
        break;

      case 'delete':
        control.reset(null);
        state.set('start');
        break;

      default:
        console.error('Ignoring unknown point of contact action: ', action);
        break;
    }
  }

  // todo: maybe refactor this to be DRY ?
  private savePOC(): void {
    let pocs = [];

    let primaryData = this.primaryPOC.value;
    if (primaryData) {
      primaryData.type = this.pocConfig.primary.type;
      delete primaryData.contactId;
      pocs.push(primaryData);
    }

    let secondaryData = this.secondaryPOC.value;
    if (secondaryData) {
      secondaryData.type = this.pocConfig.secondary.type;
      delete secondaryData.contactId;
      pocs.push(secondaryData);
    }

    this.oppContactInfoViewModel.pointOfContact = pocs;
  }

  private loadPOC(name: string): any {
    if (name === this.pocConfig.primary.type) {
      return this.oppContactInfoViewModel.primaryPOC;
    }

    if (name === this.pocConfig.secondary.type) {
      return this.oppContactInfoViewModel.secondaryPOC;
    }
  }
}
