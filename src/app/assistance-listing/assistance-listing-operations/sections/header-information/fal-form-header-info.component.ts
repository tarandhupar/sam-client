import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FALFormService} from "../../fal-form.service";
import {FALFormViewModel} from "../../fal-form.model";
import {AutocompleteConfig} from "sam-ui-kit/types";

@Component({
  providers: [FALFormService],
  selector: 'fal-form-header-information',
  templateUrl: 'fal-form-header-info.template.html'
})

export class FALFormHeaderInfoComponent implements OnInit {
  //  TODO Remove and replace with call to FH to get cfdaCode using organization id
  falNoPrefix: string;

  @Input() viewModel: FALFormViewModel;
  @ViewChild('agencyPicker') agencyPicker;
  falHeaderInfoForm: FormGroup;

  errorMessage: string = '';
  public organizationId: string;

  // Related Program multi-select
  rpNGModel: any;
  rpListDisplay = [];
  relProAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
    placeholder: 'None Selected',
    serviceOptions: {index:'RP'},
    clearOnSelection: true, showOnEmptyInput: false  };

  constructor(private fb: FormBuilder, private service: FALFormService) {
  }

  ngOnInit() {

    this.falHeaderInfoForm = this.fb.group({
      'title': [''],
      'alternativeNames': [''],
      'programNumber': null,
      'relatedPrograms': '',
      'rpListDisplay': ['']
    });

    this.falHeaderInfoForm.valueChanges.subscribe(data => this.updateViewModel(data));

    if (!this.viewModel.isNew) {
      this.updateForm();
    }
  }

  updateViewModel(data) {
    let alternativeNames = [];
    alternativeNames.push(data.alternativeNames);

    if(data['programNumber'] === 'undefined')
      data['programNumber'] = null;

    this.viewModel.title = data['title'] || null;
    this.viewModel.alternativeNames = (alternativeNames.length > 0 ? alternativeNames : null);
    this.viewModel.programNumber = (this.falNoPrefix + data['programNumber']) || null;
    this.viewModel.relatedPrograms =  this.updateViewModelRelatedPrograms(data['rpListDisplay']);

  }

  updateViewModelRelatedPrograms(rpListDisplay){
    let relatedPrograms = [];
    if(rpListDisplay.length > 0) {
      for(let rp of rpListDisplay) {
        relatedPrograms.push(rp.code);
      }
    }
    else
      return null;

    return relatedPrograms;
  }

  private populateRelatedProgramMultiList(relatedPrograms: any) {
    for (let dataItem of relatedPrograms) {
      this.rpListDisplay.push({code: dataItem.id, name: dataItem.value});
    }
    this.relProAutocompleteConfig.placeholder = this.placeholderMsg(relatedPrograms);
  }

  updateForm() {

    let title = this.viewModel.title;

    let popularName = (this.viewModel.alternativeNames.length > 0 ? this.viewModel.alternativeNames[0] : '');

    let falNo = (this.viewModel.programNumber ? this.viewModel.programNumber : '');

    if (falNo.trim().length == 6) {
      //  Need to preserve prefix, TODO: Remove once FH API lookup is established
      this.falNoPrefix = falNo.slice(0, 3);
      falNo = falNo.slice(3, 6);
    }
    else {
      this.falNoPrefix = '';
    }

    //set organization
    this.organizationId = this.viewModel.organizationId;

    //set related programs listing
    if(this.viewModel.relatedPrograms.length > 0) {
      this.service.getRelatedProgramList(this.viewModel.relatedPrograms)
        .subscribe(data => this.populateRelatedProgramMultiList(data),
          error => {
            console.error('error retrieving program list', error);
          });
    }

    this.falHeaderInfoForm.patchValue({
      title: title,
      alternativeNames: popularName,
      programNumber: falNo,
      rpListDisplay: this.rpListDisplay
    }, {
      emitEvent: false
    });
  }

  public onOrganizationChange(org: any) {

    let orgVal;
    if(org){
      orgVal = org.value;
    }
    else
      orgVal = null;

    this.organizationId = orgVal;
    this.viewModel.organizationId = orgVal;
  }

  relatedProgramTypeChange(event) {
    this.relProAutocompleteConfig.placeholder = this.placeholderMsg(event);
  }

  relatedProglistChange() {
    this.relProAutocompleteConfig.placeholder = this.placeholderMsg(this.falHeaderInfoForm.value.rpListDisplay);
  }

  placeholderMsg(multiArray: any) {
    let PlaceholderMsg = '';
    if (multiArray.length === 1) {
      PlaceholderMsg = 'One Type Selected';
    } else if (multiArray.length > 1) {
      PlaceholderMsg = 'Multiple Types Selected';
    } else {
      PlaceholderMsg = 'None Selected';
    }
    return PlaceholderMsg;
  }

  validateSection(){

  this.agencyPicker.touched = true;
  this.agencyPicker.checkForFocus(null);

  for(let key of Object.keys(this.falHeaderInfoForm.controls)) {
    this.falHeaderInfoForm.controls[key].markAsDirty();
    this.falHeaderInfoForm.controls[key].updateValueAndValidity();
  }
}

}
