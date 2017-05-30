import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
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
  falNoPrefix: string = '';

  @Input() viewModel: FALFormViewModel;
  @ViewChild('agencyPicker') agencyPicker;
  falHeaderInfoForm: FormGroup;

  public falNo = '';
  errorMessage: string = '';
  public organizationId: string;
  public organizationData: any;

  // Related Program multi-select
  rpNGModel: any;
  rpListDisplay = [];
  relProAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
    placeholder: 'None Selected',
    serviceOptions: {index: 'RP'},
    clearOnSelection: true, showOnEmptyInput: false
  };

  constructor(private fb: FormBuilder, private service: FALFormService) {
  }

  ngOnInit() {
    this.createForm();
    this.populateMultiList();
    if (!this.viewModel.isNew) {
      this.updateForm();
    }
  }

  createForm() {
    this.falHeaderInfoForm = this.fb.group({
      'title': '',
      'alternativeNames': [''],
      'programNumber': null,
      'relatedPrograms': '',
      'rpListDisplay': ['']
    });
  }

  populateMultiList() {
    if (this.viewModel.relatedPrograms && this.viewModel.relatedPrograms.length > 0) {
      this.service.getRelatedProgramList(this.viewModel.relatedPrograms).subscribe(
        data => this.parseRelatedPrograms(data),
        error => {
          console.error('error retrieving dictionary data', error);
        });
    } else {
      this.falHeaderInfoForm.valueChanges.subscribe(data => this.updateViewModel(data));
    }
  }

  parseRelatedPrograms(data: any) {
    for (let dataItem of data) {
      this.rpListDisplay.push({code: dataItem.id, name: dataItem.value});
    }
    this.relProAutocompleteConfig.placeholder = this.placeholderMsg(data);
    this.falHeaderInfoForm.patchValue({
      rpListDisplay: this.rpListDisplay
    }, {
      emitEvent: false
    });

    this.falHeaderInfoForm.valueChanges.subscribe(data => this.updateViewModel(data));
  }

  updateViewModel(data) {

    if(this.falHeaderInfoForm.controls['title'].errors){
       if('titleTheError' in this.falHeaderInfoForm.controls['title'].errors){
        this.errorMessage = 'The word "The" should not be included in the Program title.';
      }

      if('titleProgError' in this.falHeaderInfoForm.controls['title'].errors){
        this.errorMessage = 'The word "Program" should not be included in the Program title.';
      }
    }

    let alternativeNames = [];
    let relatedPrograms = [];

    relatedPrograms = this.updateViewModelRelatedPrograms(data['rpListDisplay']);
    alternativeNames.push(data.alternativeNames);

    if (data['programNumber'] === 'undefined')
      data['programNumber'] = null;

    this.viewModel.title = data['title'] || null;
    this.viewModel.alternativeNames = (alternativeNames.length > 0 ? alternativeNames : null);
    this.viewModel.programNumber = (this.falNoPrefix + data['programNumber']) || null;
    this.viewModel.relatedPrograms = relatedPrograms.length > 0 ? relatedPrograms : [];

  }

  updateViewModelRelatedPrograms(rpListDisplay) {
    let relatedPrograms = [];
    if (rpListDisplay.length > 0) {
      for (let rp of rpListDisplay) {
        relatedPrograms.push(rp.code);
      }
    }
    return relatedPrograms;
  }

  updateForm() {
    let title = this.viewModel.title;

    let popularName = (this.viewModel.alternativeNames.length > 0 ? this.viewModel.alternativeNames[0] : '');

    this.falNo = (this.viewModel.programNumber ? this.viewModel.programNumber : '');

    if (this.falNo.trim().length == 6) {
      //  Need to preserve prefix, TODO: Remove once FH API lookup is established
      this.falNoPrefix = this.falNo.slice(0, 3);
      this.falNo = this.falNo.slice(3, 6);
    }
    else {
      this.falNoPrefix = '';
    }
    //set organization
    this.organizationId = this.viewModel.organizationId;

    //set organization name
    this.service.getOrganization(this.organizationId)
      .subscribe(data => {
        this.organizationData = data['_embedded'][0]['org'];
      }, error => {
        console.error('error retrieving organization', error);
      });

    this.falHeaderInfoForm.patchValue({
      title: title,
      alternativeNames: popularName,
      programNumber: this.falNo,
    }, {
      emitEvent: false
    });

  }

  public onOrganizationChange(org: any) {

    let orgVal;
    if (org) {
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

  validateSection() {

    setTimeout(() => {
      if(this.agencyPicker){
        this.agencyPicker.touched = true;
        this.agencyPicker.checkForFocus(null);
      }
    }, 10);

    for (let key of Object.keys(this.falHeaderInfoForm.controls)) {
      this.falHeaderInfoForm.controls[key].markAsDirty();
      this.falHeaderInfoForm.controls[key].updateValueAndValidity();
    }
  }

}
